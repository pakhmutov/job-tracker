import { ApplicationWithMeta } from "@/lib/types";
import styles from "./StatsStrip.module.scss";

type Props = {
  applications: ApplicationWithMeta[];
  onAddClick: () => void;
};

export function StatsStrip({ applications, onAddClick }: Props) {
  const total = applications.length;
  const applied = applications.filter(
    (a) => a.status === "APPLIED" || a.status === "INTERVIEW" || a.status === "OFFER"
  ).length;
  const interviews = applications.filter((a) => a.status === "INTERVIEW").length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const responseRate =
    total > 0 ? Math.round(((applied) / total) * 100) : 0;

  return (
    <div className={styles.strip}>
      <div className={styles.stats}>
        <Stat label="Total" value={total} />
        <div className={styles.divider} />
        <Stat label="Applied" value={applied} color="var(--accent-blue)" />
        <Stat label="Interviews" value={interviews} color="var(--accent-yellow)" />
        <Stat label="Offers" value={offers} color="var(--accent-green)" />
        <div className={styles.divider} />
        <Stat label="Response rate" value={`${responseRate}%`} />
      </div>

      <button className={styles.addBtn} onClick={onAddClick}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add application
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue} style={color ? { color } : undefined}>
        {value}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
