"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ApplicationWithMeta, STATUS_COLOR } from "@/lib/types";
import styles from "./ApplicationCard.module.scss";

type Props = {
  application: ApplicationWithMeta;
  onClick: () => void;
  isDragging?: boolean;
};

function formatRelativeDate(date: Date | null): string {
  if (!date) return "";
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function getFaviconUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

export function ApplicationCard({ application, onClick, isDragging }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  const favicon = getFaviconUrl(application.url);
  const dateLabel =
    formatRelativeDate(application.appliedAt ?? application.createdAt);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      onClick={onClick}
    >
      <div className={styles.top}>
        <div className={styles.company}>
          {favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={favicon} alt="" width={14} height={14} className={styles.favicon} />
          )}
          <span className={styles.companyName}>{application.company}</span>
        </div>
        {dateLabel && <span className={styles.date}>{dateLabel}</span>}
      </div>

      <p className={styles.position}>{application.position}</p>

      <div className={styles.bottom}>
        <div className={styles.meta}>
          {application.salary && (
            <span className={styles.salary}>{application.salary}</span>
          )}
          {application.location && (
            <span className={styles.location}>{application.location}</span>
          )}
        </div>
        {application.tags.length > 0 && (
          <div className={styles.tags}>
            {application.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
