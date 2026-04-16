import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { campaignSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: user.id },
      include: {
        template: { select: { name: true } },
        whatsappAccount: { select: { accountName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = campaignSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, templateId, whatsappAccountId, batchSize, delayInSeconds, scheduledAt } = validation.data;

    const template = await prisma.template.findFirst({
      where: { id: templateId, userId: user.id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const account = await prisma.whatsappAccount.findFirst({
      where: { id: whatsappAccountId, userId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: 'WhatsApp account not found' }, { status: 404 });
    }

    const leads = await prisma.lead.findMany({
      where: { userId: user.id, unsubscribed: false, optIn: true },
      select: { id: true },
    });

    if (leads.length === 0) {
      return NextResponse.json({ error: 'No eligible leads found' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId: user.id,
        whatsappAccountId,
        templateId,
        name,
        description: description || null,
        status: scheduledAt ? 'SCHEDULED' : 'RUNNING',
        batchSize,
        delayInSeconds,
        totalRecipients: leads.length,
        totalQueued: leads.length,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        startedAt: scheduledAt ? null : new Date(),
      },
    });

    await prisma.campaignLead.createMany({
      data: leads.map((lead) => ({
        campaignId: campaign.id,
        leadId: lead.id,
        status: 'QUEUED',
      })),
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        campaignId: campaign.id,
        eventType: 'CAMPAIGN_CREATED',
        description: `Campaign "${name}" created with ${leads.length} recipients`,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
