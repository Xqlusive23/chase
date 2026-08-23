"use client";

import { useMemo, useState } from "react";
import { ActivityTimeline } from "../../components/ActivityTimeline";
import { useBrandLabel } from "../../components/BrandProvider";
import { useBank } from "../../lib/bank-context";
import type { ActivityStatus } from "../../lib/types";

export default function TransactionsPage() {
  const { state } = useBank();
  const brandLabel = useBrandLabel();
  const [accountId, setAccountId] = useState("all");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ActivityStatus | "all">("all");
  const [kind, setKind] = useState<"all" | "deposit" | "withdrawal">("all");

  const items = useMemo(() => {
    return state.transactions
      .filter((item) => accountId === "all" || item.accountId === accountId)
      .filter((item) => item.description.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => kind === "all" || (kind === "deposit" ? item.amount >= 0 : item.amount < 0))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [accountId, kind, query, state.transactions]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Activity</h1>
        <p className="page-sub">Deposits show in green. Withdrawals show in red. Add more from admin if you want a longer history.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "deposit", "withdrawal"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              kind === value ? "bg-[var(--navy)] text-white" : "bg-white text-[var(--navy)] ring-1 ring-[var(--line)]"
            }`}
          >
            {value === "all" ? "All activity" : `${value}s`}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <select value={accountId} onChange={(event) => setAccountId(event.target.value)} className="field">
          <option value="all">All accounts</option>
          {state.accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {brandLabel(account.name)}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search activity"
          className="field"
        />
      </div>

      <ActivityTimeline transactions={items} accounts={state.accounts} filter={filter} onFilter={setFilter} />
    </div>
  );
}
