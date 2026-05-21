"use client";

import { useState, useTransition } from "react";
import { STATUSES, STATUS_LABEL, ApplicationWithMeta } from "@/lib/types";
import { createApplication } from "@/lib/actions";
import styles from "./AddApplicationModal.module.scss";

type Props = {
  onClose: () => void;
  onAdded: (app: ApplicationWithMeta) => void;
};

export function AddApplicationModal({ onClose, onAdded }: Props) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    company: "",
    position: "",
    url: "",
    salary: "",
    location: "",
    tags: "",
    status: "PROSPECT" as (typeof STATUSES)[number],
    notes: "",
  });

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) return;

    startTransition(async () => {
      const app = await createApplication({
        company: form.company.trim(),
        position: form.position.trim(),
        url: form.url.trim() || undefined,
        salary: form.salary.trim() || undefined,
        location: form.location.trim() || undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: form.status,
        notes: form.notes.trim() || undefined,
      });
      onAdded(app as ApplicationWithMeta);
    });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add application</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <Field label="Company *">
              <input
                className={styles.input}
                placeholder="Spotify"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                autoFocus
                required
              />
            </Field>
            <Field label="Position *">
              <input
                className={styles.input}
                placeholder="Senior Frontend Engineer"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                required
              />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Status">
              <select
                className={styles.select}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="Salary">
              <input
                className={styles.input}
                placeholder="€5k–7k / month"
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
              />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Location">
              <input
                className={styles.input}
                placeholder="Berlin / Remote"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                className={styles.input}
                placeholder="React, TypeScript"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Job URL">
            <input
              className={styles.input}
              placeholder="https://..."
              type="url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </Field>

          <Field label="Notes">
            <textarea
              className={styles.textarea}
              placeholder="Anything to remember..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
            />
          </Field>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending || !form.company || !form.position}
            >
              {isPending ? "Adding..." : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  );
}
