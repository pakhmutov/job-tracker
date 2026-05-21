import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track your job applications with a Kanban board",
  openGraph: {
    title: "Job Tracker",
    description: "Track your job applications with a Kanban board",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
