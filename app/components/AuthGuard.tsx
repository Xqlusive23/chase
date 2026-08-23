"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "../lib/session";
import { getUser, isMemberApproved } from "../lib/users";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role === "admin") {
      router.replace("/admin");
      return;
    }
    const user = getUser(session.username);
    if (!user || !isMemberApproved(user)) {
      signOut();
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page)] text-[var(--navy)]">
        Checking your session…
      </div>
    );
  }

  return <>{children}</>;
}
