"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentReceipt } from "../../../../components/PaymentReceipt";
import { loadBank } from "../../../../lib/bank-store";
import type { BankState } from "../../../../lib/types";

export default function AdminReceiptPage() {
  const params = useParams<{ username: string; id: string }>();
  const username = decodeURIComponent(params.username || "");
  const [state, setState] = useState<BankState | null>(null);

  useEffect(() => {
    setState(loadBank(username));
  }, [username]);

  if (!state) return <p className="text-[var(--muted)]">Loading receipt…</p>;

  const item = state.transactions.find((entry) => entry.id === params.id);
  if (!item) {
    return (
      <div className="panel p-6">
        Receipt not found.{" "}
        <Link href="/admin/transfers" className="text-[var(--blue)]">
          Back to transfers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/transfers" className="text-sm font-semibold text-[var(--blue)]">
        ← Transfers
      </Link>
      <PaymentReceipt
        item={{
          ...item,
          recipientBank: item.recipientBank || state.wires?.find((entry) => entry.id === item.id)?.bankName,
          recipientAccount:
            item.recipientAccount ||
            state.wires?.find((entry) => entry.id === item.id)?.accountNumber ||
            state.achs?.find((entry) => entry.id === item.id)?.accountNumber,
          routingNumber:
            item.routingNumber ||
            state.wires?.find((entry) => entry.id === item.id)?.routingNumber ||
            state.achs?.find((entry) => entry.id === item.id)?.routingNumber,
        }}
        account={state.accounts.find((account) => account.id === item.accountId)}
      />
    </div>
  );
}
