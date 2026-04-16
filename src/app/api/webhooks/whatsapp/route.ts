import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const UNSUBSCRIBE_KEYWORDS = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'send-signal-verify-token';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' });
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        if (!value.messages || !value.metadata?.phone_number_id) {
          continue;
        }

        const phoneNumberId = value.metadata.phone_number_id;

        const account = await prisma.whatsappAccount.findUnique({
          where: { phoneNumberId },
        });

        if (!account) {
          continue;
        }

        for (const message of value.messages || []) {
          await processIncomingMessage(account.id, account.userId, message, value);
        }

        for (const status of value.statuses || []) {
          await processMessageStatus(account.userId, status);
        }
      }
    }

    return NextResponse.json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processIncomingMessage(
  accountId: string,
  userId: string,
  message: any,
  value: any
) {
  const phoneNumber = message.from;
  const messageBody = message.text?.body || '';
  const messageId = message.id;

  const lead = await prisma.lead.findFirst({
    where: { userId, phoneNumber },
  });

  if (!lead) {
    const newLead = await prisma.lead.create({
      data: {
        userId,
        whatsappAccountId: accountId,
        phoneNumber,
        status: 'NEW',
        optIn: true,
      },
    });

    await prisma.conversation.upsert({
      where: {
        userId_leadId_whatsappAccountId: {
          userId,
          leadId: newLead.id,
          whatsappAccountId: accountId,
        },
      },
      create: {
        userId,
        leadId: newLead.id,
        whatsappAccountId: accountId,
        source: 'WEBHOOK',
        lastMessageAt: new Date(),
      },
      update: {
        lastMessageAt: new Date(),
      },
    });

    await prisma.conversationMessage.create({
      data: {
        conversationId: (
          await prisma.conversation.findFirst({
            where: { userId, leadId: newLead.id },
          })
        )?.id || '',
        leadId: newLead.id,
        direction: 'INBOUND',
        body: messageBody,
        whatsappMessageId: messageId,
        receivedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        leadId: newLead.id,
        eventType: 'LEAD_IMPORTED',
        description: `New lead from webhook: ${phoneNumber}`,
      },
    });

    if (UNSUBSCRIBE_KEYWORDS.includes(messageBody.toUpperCase().trim())) {
      await handleUnsubscribe(userId, newLead.id);
    } else {
      await prisma.lead.update({
        where: { id: newLead.id },
        data: { status: 'REPLIED' },
      });
    }

    return;
  }

  const existingConversation = await prisma.conversation.findFirst({
    where: { userId, leadId: lead.id },
  });

  if (existingConversation) {
    await prisma.conversation.update({
      where: { id: existingConversation.id },
      data: { lastMessageAt: new Date() },
    });

    await prisma.conversationMessage.create({
      data: {
        conversationId: existingConversation.id,
        leadId: lead.id,
        direction: 'INBOUND',
        body: messageBody,
        whatsappMessageId: messageId,
        receivedAt: new Date(),
      },
    });
  } else {
    const newConversation = await prisma.conversation.create({
      data: {
        userId,
        leadId: lead.id,
        whatsappAccountId: accountId,
        source: 'WEBHOOK',
        lastMessageAt: new Date(),
      },
    });

    await prisma.conversationMessage.create({
      data: {
        conversationId: newConversation.id,
        leadId: lead.id,
        direction: 'INBOUND',
        body: messageBody,
        whatsappMessageId: messageId,
        receivedAt: new Date(),
      },
    });
  }

  if (UNSUBSCRIBE_KEYWORDS.includes(messageBody.toUpperCase().trim())) {
    await handleUnsubscribe(userId, lead.id);
  } else {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'REPLIED' },
    });
  }
}

async function handleUnsubscribe(userId: string, leadId: string) {
  await prisma.lead.update({
    where: { id: leadId },
    data: { unsubscribed: true, unsubscribedAt: new Date(), status: 'UNSUBSCRIBED' },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      leadId,
      eventType: 'LEAD_UNSUBSCRIBED',
      description: 'Lead unsubscribed via keyword',
    },
  });
}

async function processMessageStatus(userId: string, status: any) {
  const { id: messageId, status: messageStatus, timestamp } = status;

  const message = await prisma.message.findFirst({
    where: { whatsappMessageId: messageId, userId },
  });

  if (!message) return;

  let newStatus: string | null = null;
  let timestampField: string | null = null;

  switch (messageStatus) {
    case 'sent':
      newStatus = 'SENT';
      timestampField = 'sentAt';
      break;
    case 'delivered':
      newStatus = 'DELIVERED';
      timestampField = 'deliveredAt';
      break;
    case 'read':
      newStatus = 'READ';
      timestampField = 'readAt';
      break;
    case 'failed':
      newStatus = 'FAILED';
      break;
  }

  if (newStatus) {
    const updateData: any = { status: newStatus };
    if (timestampField) {
      updateData[timestampField] = new Date(parseInt(timestamp) * 1000);
    }

    await prisma.message.update({
      where: { id: message.id },
      data: updateData,
    });

    await prisma.messageEvent.create({
      data: {
        messageId: message.id,
        eventType: newStatus === 'SENT' ? 'MESSAGE_SENT' :
                   newStatus === 'DELIVERED' ? 'MESSAGE_DELIVERED' :
                   newStatus === 'READ' ? 'MESSAGE_READ' : 'MESSAGE_FAILED',
        occurredAt: new Date(parseInt(timestamp) * 1000),
      },
    });

    if (message.campaignId) {
      const incrementField = {
        'SENT': 'totalSent',
        'DELIVERED': 'totalDelivered',
        'READ': 'totalRead',
      }[newStatus];

      if (incrementField) {
        await prisma.campaign.update({
          where: { id: message.campaignId },
          data: { [incrementField]: { increment: 1 } },
        });
      }
    }
  }
}
