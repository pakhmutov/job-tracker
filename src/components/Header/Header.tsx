import Image from "next/image";
import styles from "./Header.module.scss";

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
  signOutAction: () => Promise<void>;
};

export function Header({ user, signOutAction }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>⬡</span>
        <span className={styles.logoText}>Job Tracker</span>
      </div>

      <div className={styles.right}>
        <div className={styles.user}>
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? "User"}
              width={28}
              height={28}
              className={styles.avatar}
            />
          )}
          <span className={styles.userName}>{user.name}</span>
        </div>

        <form action={signOutAction}>
          <button type="submit" className={styles.signOut}>
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
