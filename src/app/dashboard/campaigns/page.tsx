'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, StatusBadge, Column } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import styles from './campaigns.module.css';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  totalRecipients: number;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  createdAt: string;
  scheduledAt: string | null;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Campaign>[] = [
    {
      key: 'name',
      header: 'Campaign',
      render: (campaign) => (
        <div className={styles.campaignInfo}>
          <span className={styles.campaignName}>{campaign.name}</span>
          {campaign.description && (
            <span className={styles.campaignDescription}>{campaign.description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (campaign) => <StatusBadge status={campaign.status} />,
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (campaign) => (
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: campaign.totalRecipients
                  ? `${(campaign.totalSent / campaign.totalRecipients) * 100}%`
                  : '0%',
              }}
            />
          </div>
          <span className={styles.progressText}>
            {campaign.totalSent} / {campaign.totalRecipients}
          </span>
        </div>
      ),
    },
    {
      key: 'delivered',
      header: 'Delivered',
      render: (campaign) => (
        <span className={styles.stat}>{campaign.totalDelivered}</span>
      ),
    },
    {
      key: 'read',
      header: 'Read',
      render: (campaign) => (
        <span className={styles.stat}>{campaign.totalRead}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (campaign) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/campaigns/${campaign.id}`);
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
        <h2 className={styles.title}>Campaigns</h2>
        <Button>Create Campaign</Button>
      </div>

      {campaigns.length === 0 && !loading ? (
        <EmptyState
          title="No campaigns yet"
          description="Create your first campaign to start sending personalized WhatsApp messages."
          actionLabel="Create Campaign"
          onAction={() => {}}
        />
      ) : (
        <Table
          columns={columns}
          data={campaigns}
          keyExtractor={(campaign) => campaign.id}
          loading={loading}
          onRowClick={(campaign) => router.push(`/campaigns/${campaign.id}`)}
        />
      )}
    </div>
  );
}
