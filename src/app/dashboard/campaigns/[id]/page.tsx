'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge, Table, Column } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import styles from './campaign-detail.module.css';

interface CampaignDetail {
  id: string;
  name: string;
  description: string | null;
  status: string;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  batchSize: number;
  delayInSeconds: number;
  totalRecipients: number;
  totalQueued: number;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalReplied: number;
  totalConverted: number;
  totalFailed: number;
  totalUnsubscribed: number;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    name: string;
    body: string;
  } | null;
  whatsappAccount: {
    accountName: string;
    displayPhoneNumber: string | null;
  } | null;
  campaignLeads: Array<{
    id: string;
    status: string;
    excludedReason: string | null;
    processedAt: string | null;
    lead: {
      phoneNumber: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
}

const STAT_CARDS = [
  { key: 'totalRecipients', label: 'Recipients', variant: 'neutral' },
  { key: 'totalSent', label: 'Sent', variant: 'primary' },
  { key: 'totalDelivered', label: 'Delivered', variant: 'success' },
  { key: 'totalRead', label: 'Read', variant: 'success' },
  { key: 'totalReplied', label: 'Replied', variant: 'accent' },
  { key: 'totalConverted', label: 'Converted', variant: 'accent' },
  { key: 'totalFailed', label: 'Failed', variant: 'error' },
  { key: 'totalUnsubscribed', label: 'Unsubscribed', variant: 'warning' },
] as const;

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (campaignId) fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setCampaign(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch campaign');
      }
      const data = await res.json();
      setCampaign(data.campaign);
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchCampaign();
      }
    } catch (error) {
      console.error('Failed to update campaign:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecute = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/execute`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchCampaign();
      }
    } catch (error) {
      console.error('Failed to execute campaign:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} />
        <div className={styles.skeletonGrid}>
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Campaign not found"
          description="This campaign does not exist or may have been deleted."
          actionLabel="Back to Campaigns"
          onAction={() => router.push('/campaigns')}
        />
      </div>
    );
  }

  const progress = campaign.totalRecipients > 0
    ? Math.round((campaign.totalSent / campaign.totalRecipients) * 100)
    : 0;

  const recipientColumns: Column<(typeof campaign.campaignLeads)[0]>[] = [
    {
      key: 'lead',
      header: 'Contact',
      render: (cl) => (
        <div className={styles.contactInfo}>
          <span className={styles.contactName}>
            {[cl.lead.firstName, cl.lead.lastName].filter(Boolean).join(' ') || '-'}
          </span>
          <span className={styles.contactPhone}>{cl.lead.phoneNumber}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (cl) => <StatusBadge status={cl.status} />,
    },
    {
      key: 'processedAt',
      header: 'Processed',
      render: (cl) => (
        <span className={styles.metaText}>
          {cl.processedAt ? new Date(cl.processedAt).toLocaleString() : '-'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm" onClick={() => router.push('/campaigns')}>
            ← Back
          </Button>
          <div className={styles.headerInfo}>
            <h2 className={styles.campaignName}>{campaign.name}</h2>
            {campaign.description && (
              <p className={styles.campaignDescription}>{campaign.description}</p>
            )}
          </div>
        </div>
        <div className={styles.headerActions}>
          <StatusBadge status={campaign.status} />

          {campaign.status === 'DRAFT' && (
            <Button onClick={handleExecute} loading={actionLoading}>
              Launch Campaign
            </Button>
          )}
          {campaign.status === 'RUNNING' && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('PAUSED')}
              loading={actionLoading}
            >
              Pause
            </Button>
          )}
          {campaign.status === 'PAUSED' && (
            <>
              <Button onClick={() => handleStatusChange('RUNNING')} loading={actionLoading}>
                Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange('CANCELLED')}
                loading={actionLoading}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent>
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Campaign Progress</span>
              <span className={styles.progressPercent}>{progress}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressDetail}>
              {campaign.totalSent} of {campaign.totalRecipients} messages sent
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, variant }) => (
          <div key={key} className={`${styles.statCard} ${styles[variant]}`}>
            <span className={styles.statValue}>
              {campaign[key as keyof CampaignDetail] as number}
            </span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Campaign Details */}
      <div className={styles.detailsGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.detailFields}>
              <DetailRow label="Template" value={campaign.template?.name || '-'} />
              <DetailRow
                label="WhatsApp Account"
                value={campaign.whatsappAccount?.accountName || '-'}
              />
              <DetailRow label="Batch Size" value={String(campaign.batchSize)} />
              <DetailRow label="Delay" value={`${campaign.delayInSeconds}s between batches`} />
              {campaign.scheduledAt && (
                <DetailRow
                  label="Scheduled For"
                  value={new Date(campaign.scheduledAt).toLocaleString()}
                />
              )}
              {campaign.startedAt && (
                <DetailRow
                  label="Started At"
                  value={new Date(campaign.startedAt).toLocaleString()}
                />
              )}
              {campaign.completedAt && (
                <DetailRow
                  label="Completed At"
                  value={new Date(campaign.completedAt).toLocaleString()}
                />
              )}
              <DetailRow
                label="Created"
                value={new Date(campaign.createdAt).toLocaleString()}
              />
            </div>
          </CardContent>
        </Card>

        {/* Template Preview */}
        {campaign.template && (
          <Card>
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.templatePreview}>
                <p>{campaign.template.body}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recipients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recipients ({campaign.campaignLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {campaign.campaignLeads.length > 0 ? (
            <Table
              columns={recipientColumns}
              data={campaign.campaignLeads}
              keyExtractor={(cl) => cl.id}
              emptyMessage="No recipients in this campaign"
            />
          ) : (
            <p className={styles.emptyText}>No recipients added to this campaign</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
