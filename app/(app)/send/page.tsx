"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "../../components/BackLink";
import { useBrand, useBrandLabel } from "../../components/BrandProvider";
import { TransferPinField, holdMessage, pinError } from "../../components/TransferPinField";
import { createActivity, currentAccountStatus } from "../../lib/activity";
import { useBank } from "../../lib/bank-context";
import { formatMoney } from "../../lib/format";
import { isValidEmail, noticeFromBank, notifyTransferEmail } from "../../lib/notify-transfer";
import { PayAPersonMark } from "../../components/PayAPerson";

export default function SendPage() {
  const router = useRouter();
  const { state, update } = useBank();
  const { brand } = useBrand();
  const brandLabel = useBrandLabel();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const [fromId, setFromId] = useState(cashAccounts[0]?.id ?? "");
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (sending) return;
    setError("");
    if (state.accountHold) {
      setError(holdMessage());
      return;
    }
    const blocked = pinError(state.transferPin, pin);
    if (blocked) {
      setError(blocked);
      return;
    }

    const value = Number(amount);
    const from = state.accounts.find((account) => account.id === fromId);
    if (!from || !Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount and source account.");
      return;
    }
    if (from.balance < value) {
      setError("That account does not have enough funds.");
      return;
    }
    if (!recipient.trim()) {
      setError("Recipient name is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Recipient email is required.");
      return;
    }

    const now = new Date().toISOString();
    const id = `txn_${crypto.randomUUID()}`;
    const destination = recipient.trim();
    const note = memo.trim() ? ` · ${memo.trim()}` : "";
    const accountStatus = currentAccountStatus(state);
    const outgoing = createActivity({
      id,
      accountId: fromId,
      description: `Pay ${destination}${note}`,
      category: "Transfer",
      amount: -value,
      date: now,
      status: accountStatus,
      applied: true,
      manualStatus: true,
      recipient: destination,
      recipientDetail: [email.trim(), phone.trim()].filter(Boolean).join(" · ") || undefined,
      recipientEmail: email.trim(),
      fee: 0,
      memo: memo.trim() || undefined,
      method: `${from.name} balance`,
      transferType: "p2p",
    });

    update((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === fromId ? { ...account, balance: account.balance - value } : account
      ),
      transactions: [outgoing, ...current.transactions],
    }));

    setSending(true);
    try {
      await notifyTransferEmail(noticeFromBank(outgoing, state, brand.name));
    } finally {
      router.push(`/receipt/${id}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackLink href="/payments" label="Pay & transfer" />
      <div>
        <h1 className="page-title">
          <PayAPersonMark />
        </h1>
        <p className="page-sub">Send money to someone with their name and email. Phone is optional.</p>
      </div>

      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">From</span>
          <select value={fromId} onChange={(event) => setFromId(event.target.value)} className="field">
            {cashAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {brandLabel(account.name)} · {formatMoney(account.balance)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Recipient name</span>
          <input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="Who you are paying"
            className="field"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Recipient email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Required for the payment notice"
            className="field"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Phone (optional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Mobile number"
            className="field"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Amount</span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="0.00"
            className="field"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Memo</span>
          <input
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="Optional note"
            className="field"
          />
        </label>
        {state.transferPin && <TransferPinField value={pin} onChange={setPin} />}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full" disabled={sending}>
          {sending ? "Sending payment…" : "Send payment"}
        </button>
      </form>
    </div>
  );
}
