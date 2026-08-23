"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminGuard } from "../components/AdminGuard";
import { AdminShell } from "../components/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
