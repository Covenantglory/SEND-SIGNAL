import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { templateSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.template.findMany({
      where: { userId: user.id, isArchived: false },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
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
    const validation = templateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, body: templateBody, placeholderSchemaJson, previewExampleJson } = validation.data;

    const existingTemplate = await prisma.template.findFirst({
      where: { userId: user.id, name },
      orderBy: { version: 'desc' },
    });

    const template = await prisma.template.create({
      data: {
        userId: user.id,
        name,
        body: templateBody,
        placeholderSchemaJson: placeholderSchemaJson || null,
        previewExampleJson: previewExampleJson || null,
        version: existingTemplate ? existingTemplate.version + 1 : 1,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        eventType: 'TEMPLATE_CREATED',
        description: `Template "${name}" created`,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
