'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import styles from './lead-detail.module.css';

interface LeadDetail {
  id: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  source: string | null;
  status: string;
  optIn: boolean;
  unsubscribed: boolean;
  unsubscribedAt: string | null;
  notes: string | null;
  customFields: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    tag: { id: string; name: string; color: string | null };
  }>;
  messages: Array<{
    id: string;
    direction: string;
    status: string;
    renderedBody: string | null;
    sentAt: string | null;
    createdAt: string;
  }>;
  activityLogs: Array<{
    id: string;
    eventType: string;
    description: string | null;
    createdAt: string;
  }>;
}

const LEAD_STATUSES = [
  'NEW', 'CONTACTED', 'REPLIED', 'INTERESTED',
  'NOT_INTERESTED', 'CONVERTED', 'BOUNCED', 'UNSUBSCRIBED',
];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    if (leadId) fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${leadId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setLead(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch lead');
      }
      const data = await res.json();
      setLead(data.lead);
      setEditForm({
        firstName: data.lead.firstName || '',
        lastName: data.lead.lastName || '',
        email: data.lead.email || '',
        status: data.lead.status || 'NEW',
        notes: data.lead.notes || '',
      });
    } catch (error) {
      console.error('Failed to fetch lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const data = await res.json();
        setLead((prev) => (prev ? { ...prev, ...data.lead } : prev));
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Lead not found"
          description="This lead does not exist or may have been deleted."
          actionLabel="Back to Leads"
          onAction={() => router.push('/leads')}
        />
      </div>
    );
  }

  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || 'Unknown Contact';

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm" onClick={() => router.push('/leads')}>
            ← Back
          </Button>
          <div className={styles.headerInfo}>
            <h2 className={styles.name}>{fullName}</h2>
            <span className={styles.phone}>{lead.phoneNumber}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <StatusBadge status={lead.status} />
          {lead.unsubscribed && (
            <span className={styles.unsubscribedBadge}>Unsubscribed</span>
          )}
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} loading={saving}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Lead Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className={styles.editForm}>
                <div className={styles.fieldRow}>
                  <Input
                    label="First Name"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Status</label>
                  <select
                    className={styles.select}
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={4}
                    placeholder="Add notes about this lead..."
                  />
                </div>
              </div>
            ) : (
              <div className={styles.detailFields}>
                <DetailField label="Phone Number" value={lead.phoneNumber} />
                <DetailField label="First Name" value={lead.firstName} />
                <DetailField label="Last Name" value={lead.lastName} />
                <DetailField label="Email" value={lead.email} />
                <DetailField label="Source" value={lead.source} />
                <DetailField label="Opt-in" value={lead.optIn ? 'Yes' : 'No'} />
                <DetailField label="Status" value={lead.status} />
                <DetailField
                  label="Created"
                  value={new Date(lead.createdAt).toLocaleDateString()}
                />
                {lead.notes && <DetailField label="Notes" value={lead.notes} fullWidth />}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {lead.tags.length > 0 ? (
              <div className={styles.tags}>
                {lead.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className={styles.tag}
                    style={tag.color ? { borderColor: tag.color } : {}}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No tags assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {lead.messages.length > 0 ? (
              <div className={styles.messageList}>
                {lead.messages.map((msg) => (
                  <div key={msg.id} className={styles.messageItem}>
                    <div className={styles.messageDirection}>
                      <span className={`${styles.directionDot} ${
                        msg.direction === 'OUTBOUND' ? styles.outbound : styles.inbound
                      }`} />
                      <span className={styles.messageBody}>
                        {msg.renderedBody || '(No content)'}
                      </span>
                    </div>
                    <div className={styles.messageMeta}>
                      <StatusBadge status={msg.status} />
                      <span className={styles.messageDate}>
                        {new Date(msg.sentAt || msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No messages sent to this lead yet</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {lead.activityLogs.length > 0 ? (
              <div className={styles.timeline}>
                {lead.activityLogs.map((log) => (
                  <div key={log.id} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineEvent}>
                        {log.eventType.replace(/_/g, ' ')}
                      </span>
                      {log.description && (
                        <span className={styles.timelineDescription}>
                          {log.description}
                        </span>
                      )}
                      <span className={styles.timelineDate}>
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No activity recorded yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string | null | undefined;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${styles.detailField} ${fullWidth ? styles.fullWidth : ''}`}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value || '-'}</span>
    </div>
  );
}
