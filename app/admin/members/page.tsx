"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../lib/format";
import { notifyAccountEmail } from "../../lib/notify-account";
import { loadBank } from "../../lib/bank-store";
import { isMemberApproved, listMembers, setMemberApproval } from "../../lib/users";
import type { StoredUser } from "../../lib/types";

export default function AdminMembersPage() {
  const [users, setUsers] = useState<StoredUser[]>([]);

  function refresh() {
    setUsers(listMembers().slice().sort((a, b) => Number(isMemberApproved(a)) - Number(isMemberApproved(b))));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function approve(username: string) {
    const next = setMemberApproval(username, true);
    await notifyAccountEmail({
      to: next.email || "",
      displayName: next.displayName,
      kind: "approved",
    });
    refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-sub">Open a profile to edit accounts, activity, transfers, and payment status.</p>
        </div>
        <Link href="/admin/new" className="btn-primary">
          Create member
        </Link>
      </div>

      {users.length === 0 && (
        <div className="panel px-5 py-8 text-[var(--muted)]">
          No members yet.{" "}
          <Link href="/admin/new" className="text-[var(--blue)] underline">
            Create one from admin
          </Link>
          .
        </div>
      )}

      <div className="grid gap-3">
        {users.map((user, index) => {
          const bank = loadBank(user.username);
          const cash = bank.accounts
            .filter((account) => account.type !== "credit")
            .reduce((sum, account) => sum + account.balance, 0);
          const open = bank.transactions.filter((item) => item.status !== "posted").length;
          const held = bank.transactions.filter((item) => item.status === "hold").length;
          const pending = !isMemberApproved(user);
          return (
            <div
              key={user.username}
              className="flow-item panel flex flex-wrap items-center justify-between gap-3 p-5"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Link href={`/admin/users/${encodeURIComponent(user.username)}`} className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--navy)]">{user.displayName}</p>
                <p className="text-sm text-[var(--muted)]">
                  @{user.username} · created {formatDateTime(user.createdAt)}
                </p>
              </Link>
              <div className="text-right text-sm">
                {pending ? (
                  <p className="font-semibold text-amber-700">Pending approval</p>
                ) : (
                  <p className="font-semibold text-[var(--navy)]">${cash.toFixed(2)} cash</p>
                )}
                <p className="text-[var(--muted)]">
                  {bank.transactions.length} activities · {open} open · {held} hold
                </p>
              </div>
              {pending && (
                <button type="button" onClick={() => void approve(user.username)} className="btn-primary">
                  Approve
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
