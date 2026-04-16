import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
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
        whatsappAccount: { select: { accountName: true, displayPhoneNumber: true } },
        campaignLeads: {
          include: {
            lead: { select: { phoneNumber: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: user.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    let statusChange = null;
    if (body.status && body.status !== campaign.status) {
      statusChange = body.status;
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: body.name ?? campaign.name,
        description: body.description ?? campaign.description,
        status: body.status ?? campaign.status,
        batchSize: body.batchSize ?? campaign.batchSize,
        delayInSeconds: body.delayInSeconds ?? campaign.delayInSeconds,
        completedAt: body.status === 'COMPLETED' ? new Date() : campaign.completedAt,
      },
    });

    if (statusChange) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          campaignId: id,
          eventType: `CAMPAIGN_${statusChange}` as any,
          description: `Campaign "${campaign.name}" ${statusChange.toLowerCase()}`,
        },
      });
    }

    return NextResponse.json({ campaign: updatedCampaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
