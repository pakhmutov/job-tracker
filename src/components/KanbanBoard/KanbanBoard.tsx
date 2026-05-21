"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { STATUSES, Status, ApplicationWithMeta } from "@/lib/types";
import { updateApplicationStatus } from "@/lib/actions";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { StatsStrip } from "./StatsStrip";
import { ApplicationDrawer } from "../ApplicationDrawer/ApplicationDrawer";
import { AddApplicationModal } from "../AddApplicationModal/AddApplicationModal";
import styles from "./KanbanBoard.module.scss";

type Props = {
  initialApplications: ApplicationWithMeta[];
};

export function KanbanBoard({ initialApplications }: Props) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const byStatus = (status: Status) =>
    applications
      .filter((a) => a.status === status)
      .sort((a, b) => a.order - b.order);

  const activeApp = applications.find((a) => a.id === activeId);
  const selectedApp = applications.find((a) => a.id === selectedId) ?? null;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) return;

    const overStatus = STATUSES.includes(over.id as Status)
      ? (over.id as Status)
      : applications.find((a) => a.id === over.id)?.status;

    if (overStatus && activeApp.status !== overStatus) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === active.id ? { ...a, status: overStatus } : a
        )
      );
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) return;

    const newStatus = STATUSES.includes(over.id as Status)
      ? (over.id as Status)
      : applications.find((a) => a.id === over.id)?.status ?? activeApp.status;

    startTransition(() => {
      updateApplicationStatus(active.id as string, newStatus);
    });
  }

  function handleAppAdded(app: ApplicationWithMeta) {
    setApplications((prev) => [app, ...prev]);
    setShowAddModal(false);
  }

  function handleAppUpdated(updated: ApplicationWithMeta) {
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  }

  function handleAppDeleted(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setSelectedId(null);
  }

  return (
    <div className={styles.wrapper}>
      <StatsStrip
        applications={applications}
        onAddClick={() => setShowAddModal(true)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={byStatus(status)}
              onCardClick={(id) => setSelectedId(id)}
              onAddClick={() => setShowAddModal(true)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApp && (
            <ApplicationCard
              application={activeApp}
              onClick={() => {}}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>

      {selectedApp && (
        <ApplicationDrawer
          application={selectedApp}
          onClose={() => setSelectedId(null)}
          onUpdate={handleAppUpdated}
          onDelete={handleAppDeleted}
        />
      )}

      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleAppAdded}
        />
      )}
    </div>
  );
}
