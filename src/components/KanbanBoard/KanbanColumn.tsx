"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Status, STATUS_LABEL, STATUS_COLOR, STATUS_DIM, ApplicationWithMeta } from "@/lib/types";
import { ApplicationCard } from "./ApplicationCard";
import styles from "./KanbanColumn.module.scss";

type Props = {
  status: Status;
  applications: ApplicationWithMeta[];
  onCardClick: (id: string) => void;
  onAddClick: () => void;
};

export function KanbanColumn({ status, applications, onCardClick, onAddClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={styles.column}
      style={{
        ["--status-color" as string]: STATUS_COLOR[status],
        ["--status-dim" as string]: STATUS_DIM[status],
      }}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.dot} />
          <span className={styles.title}>{STATUS_LABEL[status]}</span>
          <span className={styles.count}>{applications.length}</span>
        </div>
        <button className={styles.addBtn} onClick={onAddClick} aria-label="Add application">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.dropzone} ${isOver ? styles.over : ""}`}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => onCardClick(app.id)}
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className={styles.empty}>
            <span>Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
}
