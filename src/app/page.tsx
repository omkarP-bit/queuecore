import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>InstaAmbulance</h1>
        <p>Rapid Hospital Queuing System</p>
        
        <div className={styles.ctas}>
          <Link href="/patient" className={styles.primary}>
            I am a Patient
          </Link>
          <Link href="/receptionist" className={styles.secondary}>
            I am a Receptionist
          </Link>
        </div>
      </main>
    </div>
  );
}
