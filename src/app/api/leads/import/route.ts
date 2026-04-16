import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { normalizePhoneNumber } from '@/lib/phone';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mappingStr = formData.get('mapping') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mapping = mappingStr ? JSON.parse(mappingStr) : {};

    const text = await file.text();
    
    return new Promise<NextResponse>((resolve) => {
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          try {
            const data = results.data as Record<string, string>[];
            let imported = 0;
            let skipped = 0;
            const errors: string[] = [];

            for (const row of data) {
              const phoneColumn = Object.keys(mapping).find(k => mapping[k] === 'phone_number');
              if (!phoneColumn) continue;

              const phone = row[phoneColumn];
              const normalizedPhone = normalizePhoneNumber(phone);

              if (!normalizedPhone) {
                skipped++;
                errors.push(`Invalid phone number: ${phone}`);
                continue;
              }

              const existingLead = await prisma.lead.findFirst({
                where: { userId: user.id, phoneNumber: normalizedPhone },
              });

              if (existingLead) {
                skipped++;
                continue;
              }

              const firstNameColumn = Object.keys(mapping).find(k => mapping[k] === 'first_name');
              const lastNameColumn = Object.keys(mapping).find(k => mapping[k] === 'last_name');
              const emailColumn = Object.keys(mapping).find(k => mapping[k] === 'email');
              const sourceColumn = Object.keys(mapping).find(k => mapping[k] === 'source');

              await prisma.lead.create({
                data: {
                  userId: user.id,
                  phoneNumber: normalizedPhone,
                  firstName: firstNameColumn ? row[firstNameColumn] || null : null,
                  lastName: lastNameColumn ? row[lastNameColumn] || null : null,
                  email: emailColumn ? row[emailColumn] || null : null,
                  source: sourceColumn ? row[sourceColumn] || null : null,
                  status: 'NEW',
                  optIn: true,
                },
              });

              imported++;
            }

            await prisma.activityLog.create({
              data: {
                userId: user.id,
                eventType: 'LEAD_IMPORTED',
                description: `Imported ${imported} leads`,
                metadataJson: JSON.stringify({ imported, skipped }),
              },
            });

            resolve(NextResponse.json({
              imported,
              skipped,
              errors: errors.slice(0, 10),
            }));
          } catch (error) {
            console.error('Import error:', error);
            resolve(NextResponse.json({ error: 'Import failed' }, { status: 500 }));
          }
        },
        error: () => {
          resolve(NextResponse.json({ error: 'Failed to parse CSV' }, { status: 400 }));
        },
      });
    });
  } catch (error) {
    console.error('Error importing leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
