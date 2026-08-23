"use client";

import Link from "next/link";
import type { Account } from "../lib/types";
import { accountBalanceLabel, displayBalance, formatMoney, hiddenBalance, maskAccount } from "../lib/format";
import { labeledAccountName } from "../lib/brand";
import { BrandText } from "./BrandText";
import { useBrand } from "./BrandProvider";
import { IconAlert, IconChevron } from "./Icons";

export function AccountGroup({
  title,
  accounts,
  hideBalances = false,
}: {
  title: string;
  accounts: Account[];
  hideBalances?: boolean;
}) {
  const { brand } = useBrand();
  if (accounts.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      <div className="bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white">
        {title} ({accounts.length})
      </div>
      <div className="divide-y divide-[var(--line)]">
        {accounts.map((account) => {
          const credit = account.type === "credit";
          const shown = displayBalance(account.type, account.balance);
          const overdrawn = !credit && account.balance < 0;
          return (
            <Link key={account.id} href={`/accounts/${account.id}`} className="block px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
                  <BrandText of={labeledAccountName(account.name, account.type, brand.name)} /> {maskAccount(account.number)}
                </p>
                <IconChevron className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)]" />
              </div>
              <p className={`mt-2 text-3xl font-bold tracking-tight ${overdrawn ? "text-red-600" : "text-[var(--ink)]"}`}>
                {hideBalances ? hiddenBalance() : formatMoney(shown)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{accountBalanceLabel(account.type)}</p>
              {overdrawn && (
                <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                  <IconAlert className="mt-0.5 shrink-0" />
                  Your account is overdrawn, but you may be able to take action to avoid overdraft fees.
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
