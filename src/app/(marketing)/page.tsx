import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import styles from './page.module.css';

const features = [
  {
    title: 'Import & Organize Leads',
    description: 'Upload CSV files with flexible column mapping, automatic phone validation, and duplicate detection. Tag and segment your contacts for targeted outreach.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    title: 'Message Templates',
    description: 'Create reusable templates with dynamic placeholders like first name, last name, and source. Preview messages with sample lead data before sending.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 7H17M7 12H17M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Automated Campaigns',
    description: 'Launch personalized WhatsApp campaigns with configurable batch sizes and delays. Schedule sends and track every message from queue to delivery.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 12C22 16.714 16.4183 20 12 20C7.58172 20 2 16.714 2 12C2 7.286 7.58172 4 12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 12V16C22 17.1046 21.1046 18 20 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Real-Time Analytics',
    description: 'Track sent, delivered, read, and replied messages. Monitor campaign performance with detailed analytics and activity timelines for every lead.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 17L11 9L15 13L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Compliance Built-In',
    description: 'Automatic opt-in enforcement, unsubscribe keyword detection, and duplicate message prevention. Stay compliant with WhatsApp Business API requirements.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Conversation Management',
    description: 'Manage all lead conversations in one place. Track replies, follow up, and convert leads — all within the dashboard.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const useCases = [
  {
    title: 'Solo Founders',
    description: 'Run personalized outreach to potential customers, investors, and partners without hiring a marketing team.',
  },
  {
    title: 'Educational Institutions',
    description: 'Follow up with bootcamp applicants, send course updates, and nurture student leads at scale.',
  },
  {
    title: 'Marketing Agencies',
    description: 'Manage multiple client campaigns from one dashboard. Import client leads and run white-label WhatsApp outreach.',
  },
];

const steps = [
  {
    number: 1,
    title: 'Import Your Leads',
    description: 'Upload a CSV file and map your columns. We validate phone numbers and detect duplicates automatically.',
  },
  {
    number: 2,
    title: 'Create a Template',
    description: 'Write your message with dynamic placeholders. Preview how it looks with real lead data.',
  },
  {
    number: 3,
    title: 'Launch Your Campaign',
    description: 'Select your template, choose your leads, set batch size and delays, and schedule your send.',
  },
  {
    number: 4,
    title: 'Track Results',
    description: 'Monitor delivery, reads, and replies in real time. Follow up with engaged leads and analyze performance.',
  },
];

export default async function MarketingPage() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const ctaLink = isLoggedIn ? '/dashboard' : '/signup';
  const ctaText = isLoggedIn ? 'Go to Dashboard' : 'Get Started for Free';

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Automate Personalized WhatsApp Outreach
          </h1>
          <p className={styles.heroSubtitle}>
            Send Signal helps businesses import leads, create personalized message templates,
            and run automated WhatsApp campaigns that convert. All with full compliance built-in.
          </p>
          <div className={styles.heroCta}>
            <Link href={ctaLink} className={styles.primaryCta}>
              {ctaText}
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need for WhatsApp outreach</h2>
          <p className={styles.sectionSubtitle}>
            From lead import to campaign analytics — manage your entire outreach pipeline.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="use-cases" className={styles.useCases}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Built for teams of all sizes</h2>
          <p className={styles.sectionSubtitle}>
            Whether you are a solo founder or an agency — Send Signal scales with you.
          </p>
        </div>
        <div className={styles.useCaseGrid}>
          {useCases.map((useCase) => (
            <div key={useCase.title} className={styles.useCaseCard}>
              <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
              <p className={styles.useCaseDescription}>{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>Get started in minutes, not days.</p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to scale your outreach?</h2>
          <p className={styles.ctaSubtitle}>
            Join businesses using Send Signal to automate their WhatsApp campaigns.
          </p>
          <div className={styles.heroCta}>
            <Link href={ctaLink} className={styles.primaryCta}>
              {ctaText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
