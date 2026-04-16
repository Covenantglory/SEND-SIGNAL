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
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');

    const where: any = { userId: user.id };

    if (campaignId) where.campaignId = campaignId;
    if (leadId) where.leadId = leadId;
    if (status) where.status = status;

    const messages = await prisma.message.findMany({
      where,
      include: {
        lead: { select: { phoneNumber: true, firstName: true, lastName: true } },
        campaign: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
