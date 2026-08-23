"use client";

import { FormEvent, useState } from "react";
import { BackLink } from "../../../components/BackLink";
import { BankSelect } from "../../../components/BankSelect";
import { useBank } from "../../../lib/bank-context";

export default function LinkAccountPage() {
  const { state, update } = useBank();
  const [form, setForm] = useState({
    bankName: "",
    holder: "",
    routingNumber: "",
    accountNumber: "",
    type: "Checking",
  });
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    update((current) => ({
      ...current,
      linkedAccounts: [
        {
          id: `ext_${crypto.randomUUID()}`,
          ...form,
        },
        ...(current.linkedAccounts ?? []),
      ],
    }));
    setForm({ bankName: "", holder: "", routingNumber: "", accountNumber: "", type: "Checking" });
    setMessage("External account linked.");
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <BackLink href="/dashboard" label="Accounts" />
      <div>
        <h1 className="page-title">Link external account</h1>
        <p className="page-sub">Add another bank account using the holder name, routing number, and account number.</p>
      </div>
      <form onSubmit={handleSubmit} className="soft-card space-y-3 p-5">
        <BankSelect
          bankName={form.bankName}
          routingNumber={form.routingNumber}
          onChange={(next) => setForm((current) => ({ ...current, ...next }))}
        />
        <input className="field" placeholder="Account holder" value={form.holder} onChange={(event) => setForm((current) => ({ ...current, holder: event.target.value }))} />
        <input className="field" placeholder="Account number" value={form.accountNumber} onChange={(event) => setForm((current) => ({ ...current, accountNumber: event.target.value }))} />
        <select className="field" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
          <option>Checking</option>
          <option>Savings</option>
          <option>Credit</option>
        </select>
        {message && <p className="text-sm text-[var(--blue)]">{message}</p>}
        <button className="btn-primary w-full">Link account</button>
      </form>
      <section className="soft-card overflow-hidden">
        <div className="border-b border-[var(--line)] px-5 py-3 font-semibold">Linked accounts</div>
        <ul>
          {(state.linkedAccounts ?? []).length === 0 && <li className="px-5 py-6 text-[var(--muted)]">None linked yet.</li>}
          {(state.linkedAccounts ?? []).map((item) => (
            <li key={item.id} className="border-b border-[var(--line)] px-5 py-3 last:border-b-0">
              <p className="font-semibold">{item.bankName || "External bank"}</p>
              <p className="text-sm text-[var(--muted)]">
                {item.holder || "Account holder"} · {item.type} · {item.accountNumber || "No number"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
