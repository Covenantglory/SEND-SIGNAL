import Papa from 'papaparse';
import { normalizePhoneNumber } from './phone';

export interface CSVColumn {
  header: string;
  samples: string[];
}

export interface ColumnMapping {
  [csvColumn: string]: 'phone_number' | 'first_name' | 'last_name' | 'email' | 'source' | 'custom';
}

export interface ParsedCSVResult {
  columns: CSVColumn[];
  rows: Record<string, string>[];
  totalRows: number;
}

export function parseCSV(fileContent: string): Promise<ParsedCSVResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        const headers = results.meta.fields || [];

        const columns: CSVColumn[] = headers.map((header) => ({
          header,
          samples: data.slice(0, 5).map((row) => row[header] || ''),
        }));

        resolve({
          columns,
          rows: data,
          totalRows: data.length,
        });
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

export function transformCSVData(
  rows: Record<string, string>[],
  mapping: ColumnMapping,
  userId: string
): { valid: Array<Record<string, any>>; invalid: Array<{ row: number; reason: string }> } {
  const valid: Array<Record<string, any>> = [];
  const invalid: Array<{ row: number; reason: string }> = [];

  const seenPhones = new Set<string>();

  rows.forEach((row, index) => {
    const phoneColumn = Object.keys(mapping).find((k) => mapping[k] === 'phone_number');
    
    if (!phoneColumn) {
      invalid.push({ row: index + 1, reason: 'No phone number column mapped' });
      return;
    }

    const phoneValue = row[phoneColumn];
    const normalizedPhone = normalizePhoneNumber(phoneValue);

    if (!normalizedPhone) {
      invalid.push({ row: index + 1, reason: `Invalid phone number: ${phoneValue}` });
      return;
    }

    if (seenPhones.has(normalizedPhone)) {
      invalid.push({ row: index + 1, reason: 'Duplicate phone number in import' });
      return;
    }

    seenPhones.add(normalizedPhone);

    const leadData: Record<string, any> = {
      userId,
      phoneNumber: normalizedPhone,
      status: 'NEW',
      optIn: true,
    };

    for (const [csvColumn, mappedTo] of Object.entries(mapping)) {
      if (mappedTo === 'phone_number') continue;

      if (mappedTo === 'custom') continue;

      const value = row[csvColumn];
      if (value) {
        (leadData as any)[mappedTo] = value;
      }
    }

    valid.push(leadData);
  });

  return { valid, invalid };
}
