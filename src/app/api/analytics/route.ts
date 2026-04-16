import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    const where: any = { userId: user.id };
    if (campaignId) where.campaignId = campaignId;

    const campaigns = await prisma.campaign.findMany({
      where,
      select: {
        id: true,
        name: true,
        totalRecipients: true,
        totalQueued: true,
        totalSent: true,
        totalDelivered: true,
        totalRead: true,
        totalReplied: true,
        totalConverted: true,
        totalFailed: true,
        totalUnsubscribed: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totals = campaigns.reduce(
      (acc, campaign) => ({
        sent: acc.sent + campaign.totalSent,
        delivered: acc.delivered + campaign.totalDelivered,
        read: acc.read + campaign.totalRead,
        replied: acc.replied + campaign.totalReplied,
        converted: acc.converted + campaign.totalConverted,
        failed: acc.failed + campaign.totalFailed,
        unsubscribed: acc.unsubscribed + campaign.totalUnsubscribed,
      }),
      { sent: 0, delivered: 0, read: 0, replied: 0, converted: 0, failed: 0, unsubscribed: 0 }
    );

    return NextResponse.json({
      campaigns,
      totals,
      deliveryRate: totals.sent > 0 ? Math.round((totals.delivered / totals.sent) * 100) : 0,
      readRate: totals.delivered > 0 ? Math.round((totals.read / totals.delivered) * 100) : 0,
      replyRate: totals.delivered > 0 ? Math.round((totals.replied / totals.delivered) * 100) : 0,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
