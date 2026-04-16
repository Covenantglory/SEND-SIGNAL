import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { whatsappAccountSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = whatsappAccountSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { accountName, phoneNumberId, businessAccountId, accessToken, displayPhoneNumber } = validation.data;

    const existingAccount = await prisma.whatsappAccount.findUnique({
      where: { phoneNumberId },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: 'WhatsApp account with this Phone Number ID already exists' },
        { status: 409 }
      );
    }

    const account = await prisma.whatsappAccount.create({
      data: {
        userId: user.id,
        accountName,
        phoneNumberId,
        businessAccountId,
        accessTokenEncrypted: accessToken,
        displayPhoneNumber: displayPhoneNumber || null,
        isActive: true,
      },
    });

    return NextResponse.json({
      account: {
        id: account.id,
        accountName: account.accountName,
        phoneNumberId: account.phoneNumberId,
        isActive: account.isActive,
      },
      message: 'WhatsApp account connected successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error connecting WhatsApp account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
