"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PaymentReceipt } from "../../../components/PaymentReceipt";
import { useBank } from "../../../lib/bank-context";

export default function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const { state } = useBank();
  const item = state.transactions.find((entry) => entry.id === params.id);

  if (!item) {
    return (
      <div className="soft-card p-6">
        Receipt not found.{" "}
        <Link href="/transactions" className="font-semibold text-[var(--blue)]">
          Back to activity
        </Link>
      </div>
    );
  }

  const account = state.accounts.find((entry) => entry.id === item.accountId);

  return (
    <div className="space-y-5">
      <Link href="/transactions" className="text-sm font-semibold text-[var(--blue)]">
        ← Activity
      </Link>
      <PaymentReceipt item={item} account={account} />
    </div>
  );
}
