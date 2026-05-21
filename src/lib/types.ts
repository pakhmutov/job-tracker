import { Status } from "@prisma/client";

export type { Status };

export const STATUSES: Status[] = [
  "PROSPECT",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export const STATUS_LABEL: Record<Status, string> = {
  PROSPECT: "Prospect",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const STATUS_COLOR: Record<Status, string> = {
  PROSPECT: "var(--accent-gray)",
  APPLIED: "var(--accent-blue)",
  INTERVIEW: "var(--accent-yellow)",
  OFFER: "var(--accent-green)",
  REJECTED: "var(--accent-red)",
};

export const STATUS_DIM: Record<Status, string> = {
  PROSPECT: "var(--accent-gray-dim)",
  APPLIED: "var(--accent-blue-dim)",
  INTERVIEW: "var(--accent-yellow-dim)",
  OFFER: "var(--accent-green-dim)",
  REJECTED: "var(--accent-red-dim)",
};

export type ApplicationWithMeta = {
  id: string;
  company: string;
  position: string;
  url: string | null;
  salary: string | null;
  location: string | null;
  tags: string[];
  status: Status;
  notes: string | null;
  appliedAt: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};
