"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getApplications() {
  const userId = await getUserId();
  return prisma.application.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createApplication(data: {
  company: string;
  position: string;
  url?: string;
  salary?: string;
  location?: string;
  tags?: string[];
  status?: Status;
  notes?: string;
}) {
  const userId = await getUserId();

  const maxOrder = await prisma.application.aggregate({
    where: { userId, status: data.status ?? "PROSPECT" },
    _max: { order: true },
  });

  const app = await prisma.application.create({
    data: {
      userId,
      company: data.company,
      position: data.position,
      url: data.url ?? null,
      salary: data.salary ?? null,
      location: data.location ?? null,
      tags: data.tags ?? [],
      status: data.status ?? "PROSPECT",
      notes: data.notes ?? null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  return app;
}

export async function updateApplication(
  id: string,
  data: Partial<{
    company: string;
    position: string;
    url: string;
    salary: string;
    location: string;
    tags: string[];
    status: Status;
    notes: string;
    appliedAt: Date;
    order: number;
  }>
) {
  const userId = await getUserId();
  const app = await prisma.application.update({
    where: { id, userId },
    data,
  });
  revalidatePath("/");
  return app;
}

export async function updateApplicationStatus(id: string, status: Status) {
  const userId = await getUserId();

  const maxOrder = await prisma.application.aggregate({
    where: { userId, status },
    _max: { order: true },
  });

  const app = await prisma.application.update({
    where: { id, userId },
    data: {
      status,
      order: (maxOrder._max.order ?? -1) + 1,
      appliedAt:
        status === "APPLIED" ? new Date() : undefined,
    },
  });

  revalidatePath("/");
  return app;
}

export async function deleteApplication(id: string) {
  const userId = await getUserId();
  await prisma.application.delete({ where: { id, userId } });
  revalidatePath("/");
}
