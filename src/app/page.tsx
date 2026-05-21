import { auth, signOut } from "@/lib/auth";
import { getApplications } from "@/lib/actions";
import { KanbanBoard } from "@/components/KanbanBoard/KanbanBoard";
import { Header } from "@/components/Header/Header";
import styles from "./page.module.scss";

export default async function HomePage() {
  const session = await auth();
  const applications = await getApplications();

  return (
    <div className={styles.page}>
      <Header
        user={session!.user!}
        signOutAction={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      />
      <main className={styles.main}>
        <KanbanBoard initialApplications={applications} />
      </main>
    </div>
  );
}
