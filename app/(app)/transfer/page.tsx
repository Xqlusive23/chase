"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BankSelect } from "../../components/BankSelect";
import { useBrand, useBrandLabel } from "../../components/BrandProvider";
import { BrandText } from "../../components/BrandText";
import { TransferPinField, holdMessage, pinError } from "../../components/TransferPinField";
import { createActivity, currentAccountStatus } from "../../lib/activity";
import { useBank } from "../../lib/bank-context";
import { formatMoney } from "../../lib/format";
import { isValidEmail, noticeFromBank, notifyTransferEmail } from "../../lib/notify-transfer";

export default function TransferPage() {
  const router = useRouter();
  const { state, update } = useBank();
  const { brand } = useBrand();
  const brandLabel = useBrandLabel();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const [fromId, setFromId] = useState(cashAccounts[0]?.id ?? "");
  const [toId, setToId] = useState(cashAccounts[1]?.id ?? "");
  const [external, setExternal] = useState("");
  const [email, setEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
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
    if (!isValidEmail(email)) {
      setError("Recipient email is required.");
      return;
    }
    if (!external.trim() && (!toId || toId === fromId)) {
      setError("Choose a different destination or enter an external recipient.");
      return;
    }
    if (external.trim() && (!bankName.trim() || !routingNumber.trim() || !accountNumber.trim())) {
      setError("Choose the recipient bank and enter the account number.");
      return;
    }

    const now = new Date().toISOString();
    const id = `txn_${crypto.randomUUID()}`;
    const destinationAccount = state.accounts.find((account) => account.id === toId);
    const destination = external.trim()
      ? external.trim()
      : destinationAccount?.name ?? "account";
    const note = memo.trim() ? ` · ${memo.trim()}` : "";
    const accountStatus = currentAccountStatus(state);
    const outgoing = createActivity({
      id,
      accountId: fromId,
      description: `Transfer to ${destination}${note}`,
      category: "Transfer",
      amount: -value,
      date: now,
      status: accountStatus,
      applied: true,
      manualStatus: true,
      recipient: destination,
      recipientDetail: [email.trim(), bankName.trim()].filter(Boolean).join(" · ") || undefined,
      recipientEmail: email.trim(),
      recipientBank: bankName.trim() || undefined,
      recipientAccount: external.trim() ? accountNumber.trim() : destinationAccount?.number,
      routingNumber: routingNumber.trim() || undefined,
      fee: 0,
      method: `${from.name} balance`,
      transferType: "internal",
    });

    update((current) => {
      const accounts = current.accounts.map((account) => {
        if (account.id === fromId) return { ...account, balance: account.balance - value };
        if (!external.trim() && account.id === toId) return { ...account, balance: account.balance + value };
        return account;
      });
      const incoming = !external.trim()
        ? [createActivity({
            accountId: toId,
            description: `Transfer from ${from.name}${note}`,
            category: "Transfer",
            amount: value,
            date: now,
            status: accountStatus,
            applied: true,
            manualStatus: true,
            recipient: from.name,
            fee: 0,
            method: `${from.name} balance`,
            transferType: "internal",
          })]
        : [];

      return {
        ...current,
        accounts,
        transactions: [outgoing, ...incoming, ...current.transactions],
      };
    });

    void notifyTransferEmail(noticeFromBank(outgoing, state, brand.name));
    router.push(`/receipt/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="page-title">Pay & transfer</h1>
        <p className="page-sub">Move money between your accounts or send it to a named recipient.</p>
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
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">To another <BrandText /> account</span>
          <select value={toId} onChange={(event) => setToId(event.target.value)} className="field">
            {cashAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {brandLabel(account.name)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Or send to someone else</span>
          <input
            value={external}
            onChange={(event) => setExternal(event.target.value)}
            placeholder="Recipient name"
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
            placeholder="Required for the transfer notice"
            className="field"
          />
        </label>
        {external.trim() && (
          <>
            <BankSelect
              bankName={bankName}
              routingNumber={routingNumber}
              onChange={(next) => {
                setBankName(next.bankName);
                setRoutingNumber(next.routingNumber);
              }}
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Account number</span>
              <input
                value={accountNumber}
                onChange={(event) => setAccountNumber(event.target.value)}
                placeholder="Recipient account number"
                className="field"
              />
            </label>
          </>
        )}
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
        {message && <p className="text-sm text-[var(--blue)]">{message}</p>}
        <button className="btn-primary w-full">Send transfer</button>
      </form>
    </div>
  );
}
