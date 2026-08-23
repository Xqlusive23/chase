"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ACTIVITY_STATUSES, currentAccountStatus, setAccountActivityStatus, statusLabel } from "../../lib/activity";
import { loadBank, saveBank } from "../../lib/bank-store";
import { formatDateTime, formatMoney } from "../../lib/format";
import { listMembers } from "../../lib/users";
import type { ActivityStatus, Transaction } from "../../lib/types";

type Group = {
  username: string;
  displayName: string;
  status: ActivityStatus;
  items: Transaction[];
};

export default function AdminTransfersPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filter, setFilter] = useState<ActivityStatus | "all">("all");

  function refresh() {
    const next: Group[] = listMembers().map((user) => {
      const bank = loadBank(user.username);
      const items = bank.transactions.filter(
        (item) => item.category === "Transfer" || item.transferType || item.category === "Bills" || item.category === "Income"
      );
      return {
        username: user.username,
        displayName: user.displayName,
        status: currentAccountStatus(bank),
        items,
      };
    });
    setGroups(next);
  }

  useEffect(() => {
    refresh();
  }, []);

  function changeStatus(username: string, status: ActivityStatus) {
    const bank = loadBank(username);
    saveBank(username, setAccountActivityStatus(bank, status));
    refresh();
  }

  const visible = groups.filter((group) => filter === "all" || group.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Transfers</h1>
        <p className="page-sub">Set Pending, Processing, Hold, or Posted for transfers this member makes after you change it. Existing payments keep their current status.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", ...ACTIVITY_STATUSES] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              filter === value ? "bg-[var(--navy)] text-white" : "bg-white text-[var(--navy)] ring-1 ring-[var(--line)]"
            }`}
          >
            {value === "all" ? "All" : statusLabel(value)}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {visible.length === 0 && <div className="panel px-5 py-8 text-[var(--muted)]">No matching member accounts.</div>}
        {visible.map((group) => (
          <section key={group.username} className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
              <div>
                <Link href={`/admin/users/${encodeURIComponent(group.username)}`} className="font-semibold text-[var(--navy)]">
                  {group.displayName}
                </Link>
                <p className="text-sm text-[var(--muted)]">
                  @{group.username} · {group.items.length} payments
                </p>
              </div>
              <select
                value={group.status}
                onChange={(event) => changeStatus(group.username, event.target.value as ActivityStatus)}
                className="field max-w-[200px]"
              >
                {ACTIVITY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
            {group.items.length === 0 ? (
              <p className="px-5 py-6 text-[var(--muted)]">No payments yet.</p>
            ) : (
              <ul>
                {group.items.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-3 last:border-b-0">
                    <div>
                      <Link
                        href={`/admin/receipt/${encodeURIComponent(group.username)}/${encodeURIComponent(item.id)}`}
                        className="font-medium text-[var(--navy)]"
                      >
                        {item.description}
                      </Link>
                      <p className="text-sm text-[var(--muted)]">
                        {formatMoney(item.amount)} · {formatDateTime(item.date)}
                      </p>
                    </div>
                    <span className={`status-chip mt-0 w-fit ${item.status}`}>{statusLabel(item.status)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
