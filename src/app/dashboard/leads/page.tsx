'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, StatusBadge, Column } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { Modal } from '@/components/ui/modal';
import styles from './leads.module.css';

interface Lead {
  id: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  status: string;
  optIn: boolean;
  unsubscribed: boolean;
  createdAt: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const searchLower = search.toLowerCase();
    return (
      lead.phoneNumber.includes(searchLower) ||
      lead.firstName?.toLowerCase().includes(searchLower) ||
      lead.lastName?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower)
    );
  });

  const columns: Column<Lead>[] = [
    {
      key: 'phoneNumber',
      header: 'Phone',
      render: (lead) => <span className={styles.phoneNumber}>{lead.phoneNumber}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      render: (lead) => (
        <span>
          {lead.firstName || lead.lastName
            ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
            : '-'}
        </span>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => <StatusBadge status={lead.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (lead) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/leads/${lead.id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowImportModal(true)}>
          Import Leads
        </Button>
      </div>

      {leads.length === 0 && !loading ? (
        <EmptyState
          title="No leads yet"
          description="Import your first batch of leads to start sending WhatsApp messages."
          actionLabel="Import Leads"
          onAction={() => setShowImportModal(true)}
        />
      ) : (
        <Table
          columns={columns}
          data={filteredLeads}
          keyExtractor={(lead) => lead.id}
          loading={loading}
          onRowClick={(lead) => router.push(`/leads/${lead.id}`)}
          emptyMessage="No leads match your search"
        />
      )}

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={fetchLeads}
      />
    </div>
  );
}

function ImportModal({
  isOpen,
  onClose,
  onImport,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mapping', JSON.stringify({ phone_number: 'phone_number' }));

      const res = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        onImport();
        onClose();
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Leads">
      <div className={styles.importModal}>
        <div className={styles.uploadArea}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p>Click to select CSV file</p>
        </div>
        <div className={styles.importActions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} loading={loading} disabled={!file}>
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
