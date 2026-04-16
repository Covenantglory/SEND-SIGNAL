import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await prisma.whatsappAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        accountName: true,
        phoneNumberId: true,
        businessAccountId: true,
        displayPhoneNumber: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
