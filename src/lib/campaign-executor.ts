import prisma from './prisma';
import { sendWhatsAppMessage, renderTemplate } from './whatsapp';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

interface CampaignExecutionResult {
  campaignId: string;
  processed: number;
  succeeded: number;
  failed: number;
}

export async function executeCampaign(campaignId: string): Promise<CampaignExecutionResult> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      template: true,
      whatsappAccount: true,
      campaignLeads: {
        where: { status: { in: ['QUEUED', 'FAILED'] } },
        include: { lead: true },
      },
    },
  });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  if (!campaign.whatsappAccount.isActive) {
    throw new Error('WhatsApp account is not active');
  }

  const result: CampaignExecutionResult = {
    campaignId,
    processed: 0,
    succeeded: 0,
    failed: 0,
  };

  for (const campaignLead of campaign.campaignLeads) {
    if (campaignLead.attemptCount >= MAX_RETRIES) {
      continue;
    }

    result.processed++;

    const placeholders = {
      first_name: campaignLead.lead.firstName || '',
      last_name: campaignLead.lead.lastName || '',
      full_name: `${campaignLead.lead.firstName || ''} ${campaignLead.lead.lastName || ''}`.trim(),
      email: campaignLead.lead.email || '',
      source: campaignLead.lead.source || '',
      phone_number: campaignLead.lead.phoneNumber,
    };

    const renderedBody = renderTemplate(campaign.template.body, placeholders);

    await prisma.campaignLead.update({
      where: { id: campaignLead.id },
      data: {
        status: 'SENDING',
        lastAttemptAt: new Date(),
        attemptCount: campaignLead.attemptCount + 1,
      },
    });

    const message = await prisma.message.create({
      data: {
        userId: campaign.userId,
        whatsappAccountId: campaign.whatsappAccountId,
        campaignId: campaign.id,
        leadId: campaignLead.leadId,
        campaignLeadId: campaignLead.id,
        direction: 'OUTBOUND',
        status: 'SENDING',
        templateSnapshot: campaign.template.body,
        renderedBody,
        queuedAt: new Date(),
      },
    });

    await prisma.messageEvent.create({
      data: {
        messageId: message.id,
        eventType: 'MESSAGE_QUEUED',
        occurredAt: new Date(),
      },
    });

    const sendResult = await sendWhatsAppMessage({
      phoneNumberId: campaign.whatsappAccount.phoneNumberId,
      accessToken: campaign.whatsappAccount.accessTokenEncrypted,
      recipientPhone: campaignLead.lead.phoneNumber,
      message: renderedBody,
    });

    if (sendResult.success && sendResult.messageId) {
      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: 'SENT',
          whatsappMessageId: sendResult.messageId,
          sentAt: new Date(),
        },
      });

      await prisma.campaignLead.update({
        where: { id: campaignLead.id },
        data: {
          status: 'SENT',
          processedAt: new Date(),
        },
      });

      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          totalSent: { increment: 1 },
        },
      });

      await prisma.messageEvent.create({
        data: {
          messageId: message.id,
          eventType: 'MESSAGE_SENT',
          occurredAt: new Date(),
        },
      });

      result.succeeded++;
    } else {
      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: 'FAILED',
          failureReason: sendResult.error || 'Unknown error',
        },
      });

      const shouldRetry = campaignLead.attemptCount + 1 < MAX_RETRIES;

      await prisma.campaignLead.update({
        where: { id: campaignLead.id },
        data: {
          status: shouldRetry ? 'QUEUED' : 'FAILED',
          nextAttemptAt: shouldRetry
            ? new Date(Date.now() + RETRY_DELAY_MS)
            : null,
        },
      });

      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          totalFailed: { increment: 1 },
        },
      });

      await prisma.messageEvent.create({
        data: {
          messageId: message.id,
          eventType: 'MESSAGE_FAILED',
          eventPayloadJson: JSON.stringify({ error: sendResult.error }),
          occurredAt: new Date(),
        },
      });

      result.failed++;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const remaining = await prisma.campaignLead.count({
    where: {
      campaignId,
      status: { in: ['QUEUED', 'SENDING'] },
    },
  });

  if (remaining === 0) {
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: campaign.userId,
        campaignId: campaign.id,
        eventType: 'CAMPAIGN_COMPLETED',
        description: `Campaign "${campaign.name}" completed. Sent: ${result.succeeded}, Failed: ${result.failed}`,
        metadataJson: JSON.stringify(result),
      },
    });
  }

  return result;
}

export async function processPendingCampaigns(): Promise<void> {
  const pendingCampaigns = await prisma.campaign.findMany({
    where: {
      status: 'RUNNING',
    },
    include: {
      campaignLeads: {
        where: {
          status: { in: ['QUEUED'] },
        },
        take: 10,
      },
    },
  });

  for (const campaign of pendingCampaigns) {
    if (campaign.campaignLeads.length > 0) {
      try {
        await executeCampaign(campaign.id);
      } catch (error) {
        console.error(`Error executing campaign ${campaign.id}:`, error);
      }
    }
  }
}
