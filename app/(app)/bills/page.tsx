"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBrand, useBrandLabel } from "../../components/BrandProvider";
import { TransferPinField, holdMessage, pinError } from "../../components/TransferPinField";
import { createActivity, currentAccountStatus } from "../../lib/activity";
import { useBank } from "../../lib/bank-context";
import { formatDate, formatMoney } from "../../lib/format";
import { isValidEmail, noticeFromBank, notifyTransferEmail } from "../../lib/notify-transfer";

export default function BillsPage() {
  const router = useRouter();
  const { state, update } = useBank();
  const { brand } = useBrand();
  const brandLabel = useBrandLabel();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const [fromId, setFromId] = useState(cashAccounts[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  function payBill(billId: string) {
    if (state.accountHold) {
      setMessage(holdMessage());
      return;
    }
    const blocked = pinError(state.transferPin, pin);
    if (blocked) {
      setMessage(blocked);
      return;
    }
    const bill = state.bills.find((item) => item.id === billId);
    const from = state.accounts.find((account) => account.id === fromId);
    if (!bill || !from || bill.status === "paid") return;
    if (from.balance < bill.amount) {
      setMessage("Not enough funds in the selected account.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Recipient email is required before you pay a bill.");
      return;
    }

    const id = `bill_${crypto.randomUUID()}`;
    const transaction = createActivity({
      id,
      accountId: fromId,
      description: `Bill pay · ${bill.payee}`,
      category: "Bills",
      amount: -bill.amount,
      date: new Date().toISOString(),
      status: currentAccountStatus(state),
      applied: true,
      manualStatus: true,
      recipient: bill.payee,
      recipientEmail: email.trim(),
      recipientDetail: email.trim(),
      fee: 0,
      method: `${from.name} balance`,
      transferType: "bill",
    });
    update((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === fromId ? { ...account, balance: account.balance - bill.amount } : account
      ),
      bills: current.bills.map((item) => (item.id === billId ? { ...item, status: "paid" } : item)),
      transactions: [transaction, ...current.transactions],
    }));
    void notifyTransferEmail(noticeFromBank(transaction, state, brand.name));
    router.push(`/receipt/${id}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Bills</h1>
        <p className="page-sub">Pay utilities from one of your cash accounts.</p>
      </div>

      <label className="block max-w-md">
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

      <label className="block max-w-md">
        <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Pay from</span>
        <select value={fromId} onChange={(event) => setFromId(event.target.value)} className="field">
          {cashAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {brandLabel(account.name)} · {formatMoney(account.balance)}
            </option>
          ))}
        </select>
      </label>

      {state.transferPin && <div className="max-w-md"><TransferPinField value={pin} onChange={setPin} /></div>}
      {message && <p className="text-sm text-[var(--blue)]">{message}</p>}

      <div className="grid gap-3">
        {state.bills.map((bill) => (
          <article key={bill.id} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--navy)]">{bill.payee}</h2>
              <p className="text-sm text-[var(--muted)]">
                {bill.status === "paid" ? "Paid" : `Due ${formatDate(bill.dueDate)}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xl font-semibold">{formatMoney(bill.amount)}</p>
              <button
                disabled={bill.status === "paid"}
                onClick={() => payBill(bill.id)}
                className="btn-primary"
              >
                {bill.status === "paid" ? "Paid" : "Pay now"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
