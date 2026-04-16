'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import styles from './steps.module.css';

interface LeadImportStepProps {
  onNext: () => void;
  onDataChange: (data: { imported: number }) => void;
}

interface ParsedLead {
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  source?: string;
}

export function LeadImportStep({ onNext, onDataChange }: LeadImportStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        if (data.length === 0) {
          setError('CSV file is empty');
          return;
        }
        setColumns(results.meta.fields || []);
        setPreview(data.slice(0, 5));
      },
      error: () => {
        setError('Failed to parse CSV file');
      },
    });
  };

  const handleMappingChange = (csvColumn: string, mappedTo: string) => {
    setColumnMapping((prev) => ({ ...prev, [csvColumn]: mappedTo }));
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mapping', JSON.stringify(columnMapping));

      const res = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to import leads');
        return;
      }

      onDataChange({ imported: data.imported });
      onNext();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.step}>
      <h1 className={styles.title}>Import Your Leads</h1>
      <p className={styles.description}>
        Upload a CSV file with your contacts. We&apos;ll validate phone numbers
        and detect duplicates.
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.uploadArea}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <div className={styles.uploadContent}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 32V16M24 16L18 22M24 16L30 22" stroke="var(--color-on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 32V36C8 38.2091 9.79086 40 12 40H36C38.2091 40 40 38.2091 40 36V32" stroke="var(--color-on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Drop your CSV file here or click to browse</p>
          <span>Supports .csv files up to 10MB</span>
        </div>
      </div>

      {preview.length > 0 && (
        <div className={styles.preview}>
          <h3>Preview</h3>
          <div className={styles.previewTable}>
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>
                      <select
                        value={columnMapping[col] || ''}
                        onChange={(e) => handleMappingChange(col, e.target.value)}
                        className={styles.columnSelect}
                      >
                        <option value="">Map column...</option>
                        <option value="phone_number">Phone Number</option>
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                        <option value="email">Email</option>
                        <option value="source">Source</option>
                      </select>
                      <span className={styles.columnName}>{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col}>{row[col as keyof ParsedLead] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mappingSummary}>
            <Badge variant="info">{preview.length} rows previewed</Badge>
            <span>Full import will happen when you confirm</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleImport}
        fullWidth
        loading={loading}
        disabled={!file || Object.keys(columnMapping).length === 0}
      >
        Import Leads
      </Button>
    </div>
  );
}
