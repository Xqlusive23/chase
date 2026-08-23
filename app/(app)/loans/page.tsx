"use client";

import { FormEvent, useState } from "react";
import { useBank } from "../../lib/bank-context";
import { formatDate, formatMoney } from "../../lib/format";

export default function LoansPage() {
  const { state, update } = useBank();
  const [name, setName] = useState("Personal loan");
  const [type, setType] = useState<"personal" | "auto" | "home">("personal");
  const [amount, setAmount] = useState("8000");
  const [message, setMessage] = useState("");

  function handleApply(event: FormEvent) {
    event.preventDefault();
    const principal = Number(amount);
    if (!Number.isFinite(principal) || principal < 500) {
      setMessage("Enter a loan amount of at least $500.");
      return;
    }
    update((current) => ({
      ...current,
      loans: [
        {
          id: `loan_${crypto.randomUUID()}`,
          name,
          type,
          principal,
          balance: principal,
          rate: type === "home" ? 6.1 : type === "auto" ? 5.9 : 9.4,
          monthlyPayment: Number((principal / 36).toFixed(2)),
          nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: "applied",
        },
        ...(current.loans ?? []),
      ],
    }));
    setMessage("Application submitted. We will review it shortly.");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Loans</h1>
        <p className="page-sub">Review open loans or apply for another product.</p>
      </div>
      <div className="grid gap-4">
        {(state.loans ?? []).map((loan) => (
          <article key={loan.id} className="panel p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--blue)]">{loan.type}</p>
                <h2 className="text-xl font-semibold text-[var(--navy)]">{loan.name}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {loan.status} · {loan.rate}% APR · next due {formatDate(loan.nextDue)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{formatMoney(loan.balance)}</p>
                <p className="text-sm text-[var(--muted)]">{formatMoney(loan.monthlyPayment)} / mo</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <form onSubmit={handleApply} className="panel grid gap-3 p-6 md:grid-cols-2">
        <h2 className="text-lg font-semibold text-[var(--navy)] md:col-span-2">Apply for a loan</h2>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Product</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Type</span>
          <select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="field">
            <option value="personal">Personal</option>
            <option value="auto">Auto</option>
            <option value="home">Home</option>
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm text-[var(--muted)]">Amount</span>
          <input value={amount} onChange={(event) => setAmount(event.target.value)} className="field" />
        </label>
        {message && <p className="text-sm text-[var(--blue)] md:col-span-2">{message}</p>}
        <button className="btn-primary md:col-span-2">Submit application</button>
      </form>
    </div>
  );
}
