"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../lib/session";
import { ensureDefaultAdmin } from "../lib/users";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureDefaultAdmin();
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page)] text-[var(--navy)]">
        Opening admin…
      </div>
    );
  }

  return <>{children}</>;
}
