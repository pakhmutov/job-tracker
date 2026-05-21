"use client";

import { useState, useTransition } from "react";
import { ApplicationWithMeta, STATUS_LABEL, STATUS_COLOR, STATUSES } from "@/lib/types";
import { updateApplication, deleteApplication } from "@/lib/actions";
import styles from "./ApplicationDrawer.module.scss";

type Props = {
  application: ApplicationWithMeta;
  onClose: () => void;
  onUpdate: (app: ApplicationWithMeta) => void;
  onDelete: (id: string) => void;
};

export function ApplicationDrawer({ application, onClose, onUpdate, onDelete }: Props) {
  const [notes, setNotes] = useState(application.notes ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSaveNotes() {
    startTransition(async () => {
      const updated = await updateApplication(application.id, { notes });
      onUpdate(updated as ApplicationWithMeta);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${application.company} — ${application.position}"?`)) return;
    startTransition(async () => {
      await deleteApplication(application.id);
      onDelete(application.id);
    });
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <div className={styles.company}>
            <span className={styles.companyName}>{application.company}</span>
            <span
              className={styles.status}
              style={{ color: STATUS_COLOR[application.status] }}
            >
              {STATUS_LABEL[application.status]}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <h2 className={styles.position}>{application.position}</h2>

        <div className={styles.meta}>
          {application.salary && (
            <MetaItem icon="💰" value={application.salary} />
          )}
          {application.location && (
            <MetaItem icon="📍" value={application.location} />
          )}
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Job posting
            </a>
          )}
        </div>

        {application.tags.length > 0 && (
          <div className={styles.tags}>
            {application.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.section}>
          <label className={styles.sectionLabel}>Notes</label>
          <textarea
            className={styles.notes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            rows={6}
          />
          {notes !== (application.notes ?? "") && (
            <button
              className={styles.saveBtn}
              onClick={handleSaveNotes}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save notes"}
            </button>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.created}>
            Added {new Date(application.createdAt).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={isPending}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

function MetaItem({ icon, value }: { icon: string; value: string }) {
  return (
    <span className={styles.metaItem}>
      <span>{icon}</span>
      <span>{value}</span>
    </span>
  );
}
