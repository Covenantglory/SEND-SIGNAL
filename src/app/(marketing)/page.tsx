import Link from 'next/link';
import styles from './page.module.css';

export default async function MarketingPage() {
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
            <Link href="/signup" className={styles.primaryCta}>
              Get started for free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
