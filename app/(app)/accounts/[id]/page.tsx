"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useBrand } from "../../../components/BrandProvider";
import { BrandText } from "../../../components/BrandText";
import { labeledAccountName } from "../../../lib/brand";
import { IconChevron } from "../../../components/Icons";
import { useBank } from "../../../lib/bank-context";
import { activityKind, accountBalanceLabel, displayBalance, formatDate, formatMoney, formatSignedMoney, hiddenBalance, maskAccount } from "../../../lib/format";

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>();
  const { state } = useBank();
  const { brand } = useBrand();
  const account = state.accounts.find((item) => item.id === params.id);

  if (!account) {
    return (
      <div className="soft-card p-6">
        Account not found. <Link href="/dashboard" className="text-[var(--blue)]">Back to accounts</Link>
      </div>
    );
  }

  const history = state.transactions
    .filter((item) => item.accountId === account.id)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="space-y-5">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[var(--blue)]">
        <span className="mr-1 rotate-180"><IconChevron className="h-4 w-4" /></span>
        Accounts
      </Link>
      <div className="soft-card p-5">
        <p className="text-xs font-semibold uppercase text-[var(--muted)]">
          <BrandText of={labeledAccountName(account.name, account.type, brand.name)} /> {maskAccount(account.number)}
        </p>
        <p className={`mt-2 text-4xl font-bold ${account.type !== "credit" && account.balance < 0 ? "text-red-600" : ""}`}>
          {state.preferences?.hideBalances ? hiddenBalance() : formatMoney(displayBalance(account.type, account.balance))}
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">{accountBalanceLabel(account.type)}</p>
      </div>
      <section className="soft-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
          <h2 className="font-bold">Activity</h2>
          <Link href="/transactions" className="text-sm font-semibold text-[var(--blue)]">
            See all
          </Link>
        </div>
        <ul>
          {history.length === 0 && <li className="px-5 py-6 text-[var(--muted)]">No activity on this account.</li>}
          {history.map((item) => (
            <li key={item.id}>
              <Link href={`/receipt/${item.id}`} className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-3 last:border-b-0">
                <p className="min-w-0 flex-1 truncate font-medium">{item.description}</p>
                <p className="hidden shrink-0 text-sm capitalize text-[var(--muted)] sm:block">
                  {activityKind(item.amount)} · {formatDate(item.date)}
                </p>
                <p className={`w-24 shrink-0 text-right font-semibold ${item.amount >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {formatSignedMoney(item.amount)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
