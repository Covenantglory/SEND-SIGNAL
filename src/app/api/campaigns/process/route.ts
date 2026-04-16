import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const runningCampaigns = await prisma.campaign.findMany({
      where: { status: 'RUNNING' },
      include: {
        template: true,
        whatsappAccount: true,
        campaignLeads: {
          where: { status: 'QUEUED' },
          take: 10,
          include: { lead: true },
        },
      },
    });

    for (const campaign of runningCampaigns) {
      for (const campaignLead of campaign.campaignLeads) {
        if (campaignLead.lead.unsubscribed) {
          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: { status: 'UNSUBSCRIBED', processedAt: new Date() },
          });
          continue;
        }

        const message = await prisma.message.create({
          data: {
            userId: campaign.userId,
            whatsappAccountId: campaign.whatsappAccountId,
            campaignId: campaign.id,
            leadId: campaignLead.leadId,
            campaignLeadId: campaignLead.id,
            direction: 'OUTBOUND',
            status: 'SENDING',
            renderedBody: campaign.template.body,
            queuedAt: new Date(),
          },
        });

        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: { status: 'SENDING', lastAttemptAt: new Date(), attemptCount: campaignLead.attemptCount + 1 },
        });

        await prisma.messageEvent.create({
          data: {
            messageId: message.id,
            eventType: 'MESSAGE_QUEUED',
            occurredAt: new Date(),
          },
        });

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { totalSent: { increment: 1 } },
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const remaining = await prisma.campaignLead.count({
        where: { campaignId: campaign.id, status: 'QUEUED' },
      });

      if (remaining === 0) {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });

        await prisma.activityLog.create({
          data: {
            userId: campaign.userId,
            campaignId: campaign.id,
            eventType: 'CAMPAIGN_COMPLETED',
            description: `Campaign "${campaign.name}" completed`,
          },
        });
      }
    }

    return NextResponse.json({ processed: runningCampaigns.length });
  } catch (error) {
    console.error('Error processing campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
