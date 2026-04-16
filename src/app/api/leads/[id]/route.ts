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

    const lead = await prisma.lead.findFirst({
      where: { id, userId: user.id },
      include: {
        leadTagAssignments: { include: { tag: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 10 },
        activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
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

    const lead = await prisma.lead.findFirst({
      where: { id, userId: user.id },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        firstName: body.firstName ?? lead.firstName,
        lastName: body.lastName ?? lead.lastName,
        email: body.email ?? lead.email,
        status: body.status ?? lead.status,
        notes: body.notes ?? lead.notes,
        unsubscribed: body.unsubscribed ?? lead.unsubscribed,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        leadId: id,
        eventType: 'LEAD_UPDATED',
        description: `Lead ${lead.phoneNumber} updated`,
      },
    });

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findFirst({
      where: { id, userId: user.id },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await prisma.lead.delete({ where: { id } });

    return NextResponse.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
