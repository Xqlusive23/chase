"use client";

import Link from "next/link";
import { countByStatus, statusLabel } from "../lib/activity";
import { activityKind, formatDate, formatSignedMoney } from "../lib/format";
import type { Account, ActivityStatus, Transaction } from "../lib/types";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  filter: ActivityStatus | "all";
  onFilter: (value: ActivityStatus | "all") => void;
  hrefFor?: (id: string) => string;
};

export function ActivityTimeline({ transactions, accounts, filter, onFilter, hrefFor }: Props) {
  const counts = countByStatus(transactions);
  const visible = transactions.filter((item) => filter === "all" || item.status === filter);

  return (
    <div className="space-y-5">
      <div className="panel grid gap-0 overflow-hidden md:grid-cols-4">
        {(["pending", "processing", "hold", "posted"] as ActivityStatus[]).map((status, index) => (
          <button
            key={status}
            type="button"
            onClick={() => onFilter(filter === status ? "all" : status)}
            className={`flex items-center justify-between px-5 py-4 text-left transition-colors duration-300 ${
              index < 3 ? "border-b border-[var(--line)] md:border-b-0 md:border-r" : ""
            } ${filter === status ? "bg-[var(--sky)]" : "hover:bg-[var(--page)]"}`}
          >
            <div>
              <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">{statusLabel(status)}</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--navy)]">{counts[status]}</p>
            </div>
            <span className={`status-dot ${status}`} />
          </button>
        ))}
      </div>

      <section className="panel overflow-hidden">
        {visible.length === 0 && <div className="px-5 py-8 text-[var(--muted)]">No matching activity.</div>}
        {visible.map((item) => {
          const account = accounts.find((entry) => entry.id === item.accountId);
          return (
            <Link
              href={hrefFor ? hrefFor(item.id) : `/receipt/${item.id}`}
              key={item.id}
              className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 last:border-b-0"
            >
              <span className={`status-dot shrink-0 ${item.status}`} />
              <p className="min-w-0 flex-1 truncate font-semibold text-[var(--navy)]">{item.description}</p>
              <p className="hidden shrink-0 text-sm text-[var(--muted)] sm:block">
                {item.category} · {account?.name} · {formatDate(item.date)}
              </p>
              <p className="hidden shrink-0 text-xs font-semibold uppercase text-[var(--muted)] md:block">
                {activityKind(item.amount)}
              </p>
              <p className={`status-chip mt-0 shrink-0 ${item.status}`}>{statusLabel(item.status)}</p>
              <p className={`w-24 shrink-0 text-right font-semibold ${item.amount >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                {formatSignedMoney(item.amount)}
              </p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
