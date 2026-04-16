import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import styles from './dashboard-page.module.css';

async function getDashboardStats(userId: string) {
  const [
    leadsCount,
    campaignsCount,
    activeCampaigns,
    messagesSent,
    templatesCount,
  ] = await Promise.all([
    prisma.lead.count({ where: { userId } }),
    prisma.campaign.count({ where: { userId } }),
    prisma.campaign.count({ where: { userId, status: 'RUNNING' } }),
    prisma.message.count({ where: { userId, direction: 'OUTBOUND', status: { in: ['SENT', 'DELIVERED', 'READ'] } } }),
    prisma.template.count({ where: { userId, isArchived: false } }),
  ]);

  const recentActivity = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      lead: { select: { firstName: true, lastName: true, phoneNumber: true } },
      campaign: { select: { name: true } },
    },
  });

  return {
    leadsCount,
    campaignsCount,
    activeCampaigns,
    messagesSent,
    templatesCount,
    recentActivity,
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const stats = await getDashboardStats(user.id);

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--color-primary-container)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="var(--color-primary)" strokeWidth="2"/>
                <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.leadsCount.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Leads</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--color-secondary-container)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 3L12 13L9 10L2 17L4 19L9 14L12 17L22 7" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.campaignsCount}</span>
              <span className={styles.statLabel}>Campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--color-success-container)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="var(--color-success)" strokeWidth="2"/>
                <path d="M12 8V12L14 14" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.activeCampaigns}</span>
              <span className={styles.statLabel}>Active Campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--color-accent-container)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 12C22 16.714 16.4183 20 12 20C7.58172 20 2 16.714 2 12C2 7.286 7.58172 4 12 4" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 12V16C22 17.1046 21.1046 18 20 18H19" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12V12.01" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.messagesSent.toLocaleString()}</span>
              <span className={styles.statLabel}>Messages Sent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.contentGrid}>
        <Card className={styles.activityCard}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <p className={styles.emptyText}>No recent activity</p>
            ) : (
              <div className={styles.activityList}>
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {getActivityIcon(activity.eventType)}
                    </div>
                    <div className={styles.activityContent}>
                      <span className={styles.activityDescription}>{activity.description}</span>
                      <span className={styles.activityTime}>
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={styles.quickActionsCard}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.quickActions}>
              <a href="/leads" className={styles.quickAction}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 17C3 13.6863 6.13401 11 10 11C13.866 11 17 13.6863 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Import Leads
              </a>
              <a href="/templates" className={styles.quickAction}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Create Template
              </a>
              <a href="/campaigns" className={styles.quickAction}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17 3L7 13L4 10L2 12L4 14L7 11L18 1L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Launch Campaign
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getActivityIcon(eventType: string) {
  switch (eventType) {
    case 'LEAD_IMPORTED':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'CAMPAIGN_STARTED':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L12 8L6 12V4Z" fill="var(--color-success)"/>
        </svg>
      );
    case 'MESSAGE_SENT':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="var(--color-on-surface-variant)" strokeWidth="1.5"/>
        </svg>
      );
  }
}
