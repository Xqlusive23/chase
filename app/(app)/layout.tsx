"use client";

import { AppShell } from "../components/AppShell";
import { AuthGuard } from "../components/AuthGuard";
import { BankProvider } from "../lib/bank-context";

export default function SignedInLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <BankProvider>
        <AppShell>{children}</AppShell>
      </BankProvider>
    </AuthGuard>
  );
}
