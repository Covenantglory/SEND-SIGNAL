import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: user.id },
      include: {
        template: true,
        whatsappAccount: true,
        campaignLeads: {
          where: { status: 'QUEUED' },
          take: 100,
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'RUNNING' && campaign.status !== 'PAUSED') {
      return NextResponse.json({ error: 'Campaign cannot be executed' }, { status: 400 });
    }

    await prisma.campaign.update({
      where: { id },
      data: {
        status: 'RUNNING',
        startedAt: campaign.startedAt || new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        campaignId: id,
        eventType: 'CAMPAIGN_STARTED',
        description: `Campaign "${campaign.name}" started`,
      },
    });

    return NextResponse.json({ message: 'Campaign execution started' });
  } catch (error) {
    console.error('Error executing campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
