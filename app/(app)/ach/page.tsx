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

export default function AchPage() {
  const router = useRouter();
  const { state, update } = useBank();
  const { brand } = useBrand();
  const brandLabel = useBrandLabel();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const [form, setForm] = useState({
    accountId: cashAccounts[0]?.id ?? "",
    direction: "push" as "push" | "pull",
    recipient: "",
    email: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    amount: "",
  });
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
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
      setError("Enter a valid ACH amount.");
      return;
    }
    if (!form.recipient.trim() || !form.bankName.trim() || !form.routingNumber.trim() || !form.accountNumber.trim()) {
      setError("Recipient, bank, routing number, and account number are required.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Recipient email is required.");
      return;
    }
    if (form.direction === "push" && from.balance < value) {
      setError("That account does not have enough funds.");
      return;
    }

    const id = `ach_${crypto.randomUUID()}`;
    const signed = form.direction === "push" ? -value : value;
    const accountStatus = currentAccountStatus(state);
    const transaction = createActivity({
      id,
      accountId: form.accountId,
      description: form.direction === "push" ? `ACH to ${form.recipient}` : `ACH from ${form.recipient}`,
      category: "Transfer",
      amount: signed,
      date: new Date().toISOString(),
      status: accountStatus,
      applied: form.direction === "push",
      manualStatus: true,
      recipient: form.recipient.trim(),
      recipientDetail: `${form.email.trim()} · ${form.bankName.trim()}`,
      recipientEmail: form.email.trim(),
      recipientBank: form.bankName.trim(),
      recipientAccount: form.accountNumber.trim(),
      routingNumber: form.routingNumber.trim(),
      fee: 0,
      method: `${from.name} balance`,
      transferType: "ach",
    });
    update((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === form.accountId && form.direction === "push"
          ? { ...account, balance: account.balance - value }
          : account
      ),
      achs: [
        {
          id,
          accountId: form.accountId,
          direction: form.direction,
          recipient: form.recipient.trim(),
          routingNumber: form.routingNumber.trim(),
          accountNumber: form.accountNumber.trim(),
          amount: value,
          date: new Date().toISOString(),
          status: accountStatus,
        },
        ...(current.achs ?? []),
      ],
      transactions: [transaction, ...current.transactions],
    }));
    void notifyTransferEmail(noticeFromBank(transaction, state, brand.name));
    router.push(`/receipt/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="page-title">ACH transfer</h1>
        <p className="page-sub">Send money to another bank or request a pull into your account.</p>
      </div>
      <form onSubmit={handleSubmit} className="panel grid gap-3 p-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">From account</span>
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
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Direction</span>
          <select
            value={form.direction}
            onChange={(event) => setForm((current) => ({ ...current, direction: event.target.value as "push" | "pull" }))}
            className="field"
          >
            <option value="push">Send (ACH credit)</option>
            <option value="pull">Receive (ACH debit)</option>
          </select>
        </label>
        <input className="field md:col-span-2" placeholder="Recipient name" value={form.recipient} onChange={(event) => setForm((current) => ({ ...current, recipient: event.target.value }))} required />
        <input className="field md:col-span-2" type="email" required placeholder="Recipient email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <BankSelect
          bankName={form.bankName}
          routingNumber={form.routingNumber}
          onChange={(next) => setForm((current) => ({ ...current, ...next }))}
        />
        <input className="field md:col-span-2" placeholder="Account number" value={form.accountNumber} onChange={(event) => setForm((current) => ({ ...current, accountNumber: event.target.value }))} />
        <input className="field md:col-span-2" placeholder="Amount" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
        {state.transferPin && (
          <div className="md:col-span-2">
            <TransferPinField value={pin} onChange={setPin} />
          </div>
        )}
        {error && <p className="text-sm text-red-700 md:col-span-2">{error}</p>}
        <button className="btn-primary md:col-span-2">Submit ACH</button>
      </form>
      <section className="panel overflow-hidden">
        <div className="border-b border-[var(--line)] px-5 py-3 font-semibold">Recent ACH</div>
        <ul>
          {(state.achs ?? []).length === 0 && <li className="px-5 py-6 text-[var(--muted)]">No ACH transfers yet.</li>}
          {(state.achs ?? []).map((item) => (
            <li key={item.id}>
              <Link href={`/receipt/${item.id}`} className="flex justify-between px-5 py-3 text-sm hover:bg-[var(--page)]">
                <span>
                  {item.direction === "push" ? "To" : "From"} {item.recipient} · {statusLabel(item.status)} · {formatDate(item.date)}
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
