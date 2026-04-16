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

    const template = await prisma.template.findFirst({
      where: { id, userId: user.id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error fetching template:', error);
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

    const template = await prisma.template.findFirst({
      where: { id, userId: user.id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name: body.name ?? template.name,
        body: body.body ?? template.body,
        placeholderSchemaJson: body.placeholderSchemaJson ?? template.placeholderSchemaJson,
        previewExampleJson: body.previewExampleJson ?? template.previewExampleJson,
        isArchived: body.isArchived ?? template.isArchived,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        eventType: 'TEMPLATE_UPDATED',
        description: `Template "${template.name}" updated`,
      },
    });

    return NextResponse.json({ template: updatedTemplate });
  } catch (error) {
    console.error('Error updating template:', error);
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

    const template = await prisma.template.findFirst({
      where: { id, userId: user.id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    await prisma.template.delete({ where: { id } });

    return NextResponse.json({ message: 'Template deleted' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
