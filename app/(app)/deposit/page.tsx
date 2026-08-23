"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useBrand, useBrandLabel } from "../../components/BrandProvider";
import { CheckCapture } from "../../components/CheckCapture";
import { TransferPinField, holdMessage, pinError } from "../../components/TransferPinField";
import { createActivity, currentAccountStatus, statusLabel } from "../../lib/activity";
import { useBank } from "../../lib/bank-context";
import { formatDate, formatMoney, formatSignedMoney } from "../../lib/format";
import { isValidEmail, noticeFromBank, notifyTransferEmail } from "../../lib/notify-transfer";

export default function DepositPage() {
  const router = useRouter();
  const { state, update } = useBank();
  const { brand } = useBrand();
  const brandLabel = useBrandLabel();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const [accountId, setAccountId] = useState(cashAccounts[0]?.id ?? "");
  const [email, setEmail] = useState(state.email || "");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [shots, setShots] = useState<{ front: string; back: string } | null>(null);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
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
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter the check amount.");
      return;
    }
    if (!shots) {
      setError("Snap the front and back of the check.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Recipient email is required.");
      return;
    }

    const id = `dep_${crypto.randomUUID()}`;
    const account = cashAccounts.find((item) => item.id === accountId);
    const deposit = {
      id,
      accountId,
      amount: value,
      memo: memo.trim() || "Mobile check deposit",
      imageName: "Front and back snapped",
      date: new Date().toISOString(),
      status: currentAccountStatus(state),
    };
    const transaction = createActivity({
      id,
      accountId,
      description: `Mobile deposit · ${deposit.memo}`,
      category: "Income",
      amount: value,
      date: deposit.date,
      status: currentAccountStatus(state),
      manualStatus: true,
      applied: false,
      recipient: state.displayName,
      recipientEmail: email.trim(),
      recipientDetail: email.trim(),
      fee: 0,
      method: `${account?.name ?? "Account"} balance`,
      transferType: "deposit",
    });
    update((current) => ({
      ...current,
      deposits: [deposit, ...(current.deposits ?? [])],
      transactions: [transaction, ...current.transactions],
    }));
    void notifyTransferEmail(noticeFromBank(transaction, state, brand.name));
    router.push(`/receipt/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="page-title">Mobile deposit</h1>
        <p className="page-sub">Line the check up in the frame and snap both sides. Photos stay on this device.</p>
      </div>
      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        {!shots ? (
          <CheckCapture onCaptured={setShots} />
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <img src={shots.front} alt="Check front" className="h-28 w-full rounded-xl object-cover" />
              <img src={shots.back} alt="Check back" className="h-28 w-full rounded-xl object-cover" />
            </div>
            <button type="button" onClick={() => setShots(null)} className="btn-secondary w-full">
              Snap again
            </button>
          </div>
        )}
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Deposit to</span>
          <select value={accountId} onChange={(event) => setAccountId(event.target.value)} className="field">
            {cashAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {brandLabel(account.name)} · {formatMoney(account.balance)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Notification email</span>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field" placeholder="Required for the deposit notice" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Check amount</span>
          <input value={amount} onChange={(event) => setAmount(event.target.value)} className="field" placeholder="0.00" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Memo</span>
          <input value={memo} onChange={(event) => setMemo(event.target.value)} className="field" />
        </label>
        {state.transferPin && <TransferPinField value={pin} onChange={setPin} />}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-[var(--blue)]">{message}</p>}
        <button className="btn-primary w-full">Submit deposit</button>
      </form>
      <section className="panel overflow-hidden">
        <div className="border-b border-[var(--line)] px-5 py-3 font-semibold text-[var(--navy)]">Recent deposits</div>
        <ul>
          {(state.deposits ?? []).length === 0 && <li className="px-5 py-6 text-[var(--muted)]">No mobile deposits yet.</li>}
          {(state.deposits ?? []).map((item) => (
            <li key={item.id}>
              <a href={`/receipt/${item.id}`} className="flex justify-between gap-3 border-b border-[var(--line)] px-5 py-3 last:border-b-0">
                <div>
                  <p className="font-medium">{item.memo}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {item.imageName} · {formatDate(item.date)} · {statusLabel(item.status)}
                  </p>
                </div>
                <p className="font-semibold text-emerald-700">{formatSignedMoney(item.amount)}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
