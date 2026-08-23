"use client";

import { BrandText } from "../../components/BrandText";
import { useBank } from "../../lib/bank-context";
import { formatDate, formatMoney, maskAccount } from "../../lib/format";

export default function AccountsPage() {
  const { state } = useBank();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Accounts</h1>
        <p className="page-sub">Checking, savings, and card details for your profile.</p>
      </div>

      <div className="space-y-5">
        {state.accounts.map((account) => {
          const history = state.transactions
            .filter((item) => item.accountId === account.id)
            .sort((a, b) => +new Date(b.date) - +new Date(a.date))
            .slice(0, 4);

          return (
            <article key={account.id} className="panel p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--blue)]">{account.type}</p>
                  <h2 className="text-2xl font-semibold text-[var(--navy)]">
                    <BrandText of={account.name} />
                  </h2>
                  <p className="text-sm text-[var(--muted)]">{maskAccount(account.number)}</p>
                </div>
                <p className="text-3xl font-semibold text-[var(--navy)]">{formatMoney(account.balance)}</p>
              </div>
              <ul className="mt-5 divide-y divide-[var(--line)]">
                {history.length === 0 && (
                  <li className="py-3 text-sm text-[var(--muted)]">No recent activity on this account.</li>
                )}
                {history.map((item) => (
                  <li key={item.id} className="flex justify-between py-3 text-sm">
                    <span>
                      {item.description}
                      <span className="block text-[var(--muted)]">{formatDate(item.date)}</span>
                    </span>
                    <span className="font-semibold">{formatMoney(item.amount)}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
