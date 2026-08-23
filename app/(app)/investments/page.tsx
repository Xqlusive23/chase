"use client";

import { BrandText } from "../../components/BrandText";

export default function InvestmentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Investments</h1>
        <p className="page-sub">A snapshot of your brokerage balances and holdings.</p>
      </div>
      <div className="soft-card p-5">
        <p className="text-sm text-[var(--muted)]">
          <BrandText /> Invest
        </p>
        <p className="mt-2 text-3xl font-bold">$8,420.15</p>
        <p className="mt-1 text-sm text-emerald-700">+$126.40 today</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {[
          ["500 index", "$5,210.00"],
          ["Growth fund", "$2,140.15"],
          ["Cash reserve", "$1,070.00"],
        ].map(([name, value]) => (
          <article key={name} className="soft-card p-4">
            <p className="font-semibold">
              <BrandText /> {name}
            </p>
            <p className="mt-2 text-xl font-bold">{value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
