import Link from 'next/link';
import styles from './page.module.css';

export default function MarketingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Automate WhatsApp outreach<br />
            <span style={{ color: 'var(--color-primary)' }}>at scale</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Send Signal helps businesses import leads, create personalized message templates,
            and run automated WhatsApp campaigns that convert. All with full compliance built-in.
          </p>
          <div className={styles.heroCta}>
            <Link href="/signup" className={styles.primaryCta}>
              Get Started Free
            </Link>
            <a href="#features" className={styles.secondaryCta}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need to succeed</h2>
          <p className={styles.sectionSubtitle}>
            Powerful features designed for modern outreach teams
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>CSV Lead Import</h3>
            <p className={styles.featureDescription}>
              Import thousands of leads in seconds. Our smart column mapping handles any CSV format with automatic phone number validation.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 14H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Smart Templates</h3>
            <p className={styles.featureDescription}>
              Create reusable message templates with dynamic placeholders. Personalize every message with names, companies, and custom fields.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Campaign Automation</h3>
            <p className={styles.featureDescription}>
              Schedule campaigns, control batch sizes, and set delivery delays. Our system respects rate limits for optimal delivery.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>WhatsApp Integration</h3>
            <p className={styles.featureDescription}>
              Send messages directly through the official WhatsApp Business API. Reliable, compliant, and built for scale.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Real-time Analytics</h3>
            <p className={styles.featureDescription}>
              Track message delivery, read receipts, and replies in real-time. Make data-driven decisions with comprehensive reports.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Compliance Built-in</h3>
            <p className={styles.featureDescription}>
              Automatic unsubscribe handling, duplicate prevention, and opt-in management. Stay compliant without the complexity.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.useCases}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Built for modern teams</h2>
          <p className={styles.sectionSubtitle}>
            From solo founders to large agencies
          </p>
        </div>

        <div className={styles.useCaseGrid}>
          <div className={styles.useCaseCard}>
            <h3 className={styles.useCaseTitle}>Solo Founders</h3>
            <p className={styles.useCaseDescription}>
              Scale your outreach without hiring a team. Import your leads, create one template, and let Send Signal do the rest.
            </p>
          </div>

          <div className={styles.useCaseCard}>
            <h3 className={styles.useCaseTitle}>Educational Institutions</h3>
            <p className={styles.useCaseDescription}>
              Follow up with applicants, send course updates, and nurture leads through your bootcamp enrollment process.
            </p>
          </div>

          <div className={styles.useCaseCard}>
            <h3 className={styles.useCaseTitle}>Marketing Agencies</h3>
            <p className={styles.useCaseDescription}>
              Manage outreach campaigns for multiple clients from a single dashboard. White-label reports and dedicated workspaces.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>
            Get started in minutes
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Import Your Leads</h3>
            <p className={styles.stepDescription}>
              Upload your CSV file and map columns. Our system validates phone numbers and detects duplicates.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Create Templates</h3>
            <p className={styles.stepDescription}>
              Build message templates with placeholders. Preview with sample data before sending.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Launch Campaign</h3>
            <p className={styles.stepDescription}>
              Select recipients, set batch size and delay, and launch. Monitor progress in real-time.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3 className={styles.stepTitle}>Track & Optimize</h3>
            <p className={styles.stepDescription}>
              Monitor delivery, reads, and replies. Use analytics to optimize future campaigns.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to scale your outreach?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of businesses automating their WhatsApp campaigns with Send Signal.
          </p>
          <Link href="/signup" className={styles.primaryCta}>
            Start Free Today
          </Link>
        </div>
      </section>
    </div>
  );
}
