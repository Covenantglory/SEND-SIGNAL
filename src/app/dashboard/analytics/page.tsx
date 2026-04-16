import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import styles from './analytics.module.css';

async function getAnalytics(userId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      status: true,
      totalSent: true,
      totalDelivered: true,
      totalRead: true,
      totalReplied: true,
      totalFailed: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const totals = campaigns.reduce(
    (acc, campaign) => ({
      sent: acc.sent + campaign.totalSent,
      delivered: acc.delivered + campaign.totalDelivered,
      read: acc.read + campaign.totalRead,
      replied: acc.replied + campaign.totalReplied,
      failed: acc.failed + campaign.totalFailed,
    }),
    { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 }
  );

  return { campaigns, totals };
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const analytics = await getAnalytics(user.id);

  if (analytics.campaigns.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No analytics yet"
          description="Analytics will appear here after you run your first campaign."
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Campaign Analytics</h2>
      </div>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <span className={styles.statValue}>{analytics.totals.sent}</span>
            <span className={styles.statLabel}>Messages Sent</span>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <span className={styles.statValue}>{analytics.totals.delivered}</span>
            <span className={styles.statLabel}>Delivered</span>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <span className={styles.statValue}>{analytics.totals.read}</span>
            <span className={styles.statLabel}>Read</span>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <span className={styles.statValue}>{analytics.totals.replied}</span>
            <span className={styles.statLabel}>Replies</span>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <span className={styles.statValue}>
              {analytics.totals.sent > 0
                ? Math.round((analytics.totals.delivered / analytics.totals.sent) * 100)
                : 0}%
            </span>
            <span className={styles.statLabel}>Delivery Rate</span>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <span className={styles.statValue}>
              {analytics.totals.delivered > 0
                ? Math.round((analytics.totals.read / analytics.totals.delivered) * 100)
                : 0}%
            </span>
            <span className={styles.statLabel}>Read Rate</span>
          </CardContent>
        </Card>
      </div>

      <Card className={styles.campaignsCard}>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.campaignsTable}>
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Delivered</th>
                  <th>Read</th>
                  <th>Replies</th>
                  <th>Failed</th>
                </tr>
              </thead>
              <tbody>
                {analytics.campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.status}</td>
                    <td>{campaign.totalSent}</td>
                    <td>{campaign.totalDelivered}</td>
                    <td>{campaign.totalRead}</td>
                    <td>{campaign.totalReplied}</td>
                    <td>{campaign.totalFailed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
