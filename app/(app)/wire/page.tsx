"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BankSelect } from "../../components/BankSelect";
import { useBrand, useBrandLabel } from "../../components/BrandProvider";
import { TransferPinField, holdMessage, pinError } from "../../components/TransferPinField";
import { createActivity, currentAccountStatus, statusLabel } from "../../lib/activity";
import { useBank } from "../../lib/bank-context";
import { formatDate, formatMoney } from "../../lib/format";
import { isValidEmail, noticeFromBank, notifyTransferEmail } from "../../lib/notify-transfer";

const WIRE_FEE = 25;

export default function WirePage() {
  const router = useRouter();
  const { state, update } = useBank();
  const { brand } = useBrand();
  const brandLabel = useBrandLabel();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const [form, setForm] = useState({
    accountId: cashAccounts[0]?.id ?? "",
    beneficiary: "",
    email: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    swift: "",
    amount: "",
  });
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (state.accountHold) {
      setError(holdMessage());
      return;
    }
    const blocked = pinError(state.transferPin, pin);
    if (blocked) {
      setError(blocked);
      return;
    }
    const value = Number(form.amount);
    const from = state.accounts.find((account) => account.id === form.accountId);
    if (!from || !Number.isFinite(value) || value <= 0) {
      setError("Enter a valid wire amount.");
      return;
    }
    if (!form.beneficiary.trim() || !form.bankName.trim() || !form.routingNumber.trim() || !form.accountNumber.trim()) {
      setError("Beneficiary, bank, routing number, and account number are required.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Recipient email is required.");
      return;
    }
    const total = value + WIRE_FEE;
    if (from.balance < total) {
      setError(`That account needs ${formatMoney(total)} including the ${formatMoney(WIRE_FEE)} wire fee.`);
      return;
    }

    const id = `wire_${crypto.randomUUID()}`;
    const accountStatus = currentAccountStatus(state);
    const transaction = createActivity({
      id,
      accountId: form.accountId,
      description: `Wire to ${form.beneficiary}`,
      category: "Transfer",
      amount: -total,
      date: new Date().toISOString(),
      status: accountStatus,
      applied: true,
      manualStatus: true,
      recipient: form.beneficiary.trim(),
      recipientDetail: `${form.email.trim()} · ${form.bankName.trim()}`,
      recipientEmail: form.email.trim(),
      recipientBank: form.bankName.trim(),
      recipientAccount: form.accountNumber.trim(),
      routingNumber: form.routingNumber.trim(),
      fee: WIRE_FEE,
      method: `${from.name} balance`,
      transferType: "wire",
    });
    update((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === form.accountId ? { ...account, balance: account.balance - total } : account
      ),
      wires: [
        {
          id,
          accountId: form.accountId,
          beneficiary: form.beneficiary.trim(),
          bankName: form.bankName.trim(),
          routingNumber: form.routingNumber.trim(),
          accountNumber: form.accountNumber.trim(),
          swift: form.swift.trim(),
          amount: value,
          date: new Date().toISOString(),
          status: accountStatus,
        },
        ...(current.wires ?? []),
      ],
      transactions: [transaction, ...current.transactions],
    }));
    await notifyTransferEmail(noticeFromBank(transaction, state, brand.name));
    router.push(`/receipt/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="page-title">Wire transfer</h1>
        <p className="page-sub">Send a domestic or international wire. A {formatMoney(WIRE_FEE)} fee is added to the receipt.</p>
      </div>
      <form onSubmit={handleSubmit} className="panel grid gap-3 p-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm text-[var(--muted)]">From</span>
          <select
            value={form.accountId}
            onChange={(event) => setForm((current) => ({ ...current, accountId: event.target.value }))}
            className="field"
          >
            {cashAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {brandLabel(account.name)} · {formatMoney(account.balance)}
              </option>
            ))}
          </select>
        </label>
        <input className="field" placeholder="Beneficiary name" value={form.beneficiary} onChange={(event) => setForm((current) => ({ ...current, beneficiary: event.target.value }))} required />
        <input className="field" type="email" required placeholder="Recipient email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <BankSelect
          bankName={form.bankName}
          routingNumber={form.routingNumber}
          onChange={(next) => setForm((current) => ({ ...current, ...next }))}
        />
        <input className="field md:col-span-2" placeholder="Account number" value={form.accountNumber} onChange={(event) => setForm((current) => ({ ...current, accountNumber: event.target.value }))} />
        <input className="field" placeholder="SWIFT / BIC (optional)" value={form.swift} onChange={(event) => setForm((current) => ({ ...current, swift: event.target.value }))} />
        <input className="field" placeholder="Amount" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
        {state.transferPin && (
          <div className="md:col-span-2">
            <TransferPinField value={pin} onChange={setPin} />
          </div>
        )}
        {error && <p className="text-sm text-red-700 md:col-span-2">{error}</p>}
        <button className="btn-primary md:col-span-2">Send wire</button>
      </form>
      <section className="panel overflow-hidden">
        <div className="border-b border-[var(--line)] px-5 py-3 font-semibold">Recent wires</div>
        <ul>
          {(state.wires ?? []).length === 0 && <li className="px-5 py-6 text-[var(--muted)]">No wires yet.</li>}
          {(state.wires ?? []).map((item) => (
            <li key={item.id}>
              <Link href={`/receipt/${item.id}`} className="flex justify-between px-5 py-3 text-sm hover:bg-[var(--page)]">
                <span>
                  {item.beneficiary} · {statusLabel(item.status)} · {formatDate(item.date)}
                </span>
                <span className="font-semibold">{formatMoney(item.amount)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
