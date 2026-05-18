import Link from 'next/link'
import styles from './landing.module.css'

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <span className={styles.headerLogoIcon}>T</span>
          <span className={styles.headerLogoText}>Jira</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/login" className={styles.loginLink}>Sign in</Link>
          <Link href="/register" className={styles.registerBtn}>Get Started</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBadge}>Project Management Reimagined</div>
        <h1 className={styles.heroTitle}>
          Build faster.<br />Ship smarter.<br />
          <span className={styles.heroAccent}>Stay in flow.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Jira is the all-in-one project management platform that keeps your
          team aligned, productive, and shipping on time — with real-time
          collaboration built in.
        </p>
        <div className={styles.heroCTAs}>
          <Link href="/register" className={styles.ctaPrimary}>
            Start for free
          </Link>
          <Link href="/login" className={styles.ctaSecondary}>
            Sign in to your account →
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything your team needs</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureName}>Kanban Boards</h3>
            <p className={styles.featureDesc}>
              Visualize work with drag-and-drop Kanban boards. Move tasks
              across Backlog, Todo, In Progress, Review, and Done.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔔</div>
            <h3 className={styles.featureName}>Real-time Updates</h3>
            <p className={styles.featureDesc}>
              See changes instantly as your team works. No page refresh
              needed — tasks, comments, and status updates sync live.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureName}>Team Collaboration</h3>
            <p className={styles.featureDesc}>
              Invite members, assign tasks, add comments, and track who
              is online in each project at any time.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📎</div>
            <h3 className={styles.featureName}>File Attachments</h3>
            <p className={styles.featureDesc}>
              Upload task attachments and profile avatars seamlessly with
              UploadThing — files are stored securely and stay linked.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <h2 className={styles.ctaBannerTitle}>Ready to ship faster?</h2>
        <p className={styles.ctaBannerSubtitle}>
          Join teams using Jira to manage projects, track progress, and
          collaborate without friction.
        </p>
        <Link href="/register" className={styles.ctaPrimary}>
          Create your free account
        </Link>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 Jira. Built with Next.js, Node.js & WebSockets.</p>
      </footer>
    </div>
  )
}
