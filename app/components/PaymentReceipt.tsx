import type { ReactNode } from "react";
import type { Account, Transaction } from "../lib/types";
import { receiptHeadline, receiptSubcopy, statusLabel } from "../lib/activity";
import { DEFAULT_BRAND } from "../lib/brand";
import { formatLongDate, formatMoneyUsd, formatReceiptStamp, shortId } from "../lib/format";
import { BrandText } from "./BrandText";
import { Logo } from "./Logo";

export function PaymentReceipt({
  item,
  account,
}: {
  item: Transaction;
  account?: Account;
}) {
  const fee = item.fee ?? 0;
  const outgoing = item.amount < 0;
  const payment = Math.abs(item.amount) - fee;
  const total = Math.abs(item.amount);
  const tone =
    item.status === "hold"
      ? "border-orange-300 bg-orange-50 text-orange-800"
      : item.status === "posted"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : item.status === "processing"
          ? "border-sky-200 bg-sky-50 text-sky-800"
          : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <article className="mx-auto max-w-lg rounded-2xl border border-[var(--line)] bg-white px-5 py-5 shadow-sm sm:px-7">
      <header className="flex items-start justify-between gap-4">
        <Logo href="/dashboard" />
        <div className="text-right">
          <p className="text-sm font-semibold text-[var(--ink)]">Receipt</p>
          <p className="text-sm text-[var(--muted)]">{formatLongDate(new Date(item.date))}</p>
        </div>
      </header>

      <div className={`mt-5 flex items-start gap-3 rounded-xl border-l-4 px-4 py-4 ${tone}`}>
        <span className={`status-dot mt-1 ${item.status}`} />
        <div>
          <p className="text-xl font-bold">{receiptHeadline(item.status)}</p>
          <p className="mt-1 text-sm opacity-80">{receiptSubcopy(item.status)}</p>
        </div>
      </div>

      <div className="soft-card mt-5 px-5 py-6 text-center">
        <p className="text-sm text-[var(--muted)]">{outgoing ? "You sent" : "You received"}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{formatMoneyUsd(payment)}</p>
      </div>

      <dl className="mt-6 divide-y divide-[var(--line)]">
        <Row label="To">
          {item.recipientBank || item.recipientAccount || item.routingNumber ? (
            <>
              {item.recipientBank && <p className="font-semibold">{item.recipientBank}</p>}
              {item.recipientAccount && <p className="text-sm text-[var(--muted)]">Account {item.recipientAccount}</p>}
              {item.routingNumber && <p className="text-sm text-[var(--muted)]">Routing {item.routingNumber}</p>}
              {item.recipient && <p className="mt-1 text-sm text-[var(--muted)]">{item.recipient}</p>}
            </>
          ) : (
            <>
              <p className="font-semibold">{item.recipient || item.description}</p>
              {item.recipientDetail && <p className="text-sm text-[var(--muted)]">{item.recipientDetail}</p>}
            </>
          )}
        </Row>
        <Row label="Transaction ID">{shortId(item.id)}</Row>
        <Row label="Date">{formatReceiptStamp(item.date)}</Row>
        <Row label="Payment method">
          {item.method || <BrandText of={`${account?.name ?? DEFAULT_BRAND.name} balance`} />}
        </Row>
        <Row label="Status">
          <span className={`status-chip mt-0 ${item.status}`}>{statusLabel(item.status)}</span>
        </Row>
      </dl>

      <div className="mt-6 rounded-xl bg-[var(--sky)] p-4">
        <p className="text-sm font-bold text-[var(--navy)]">Amount breakdown</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Payment amount</span>
            <span>{formatMoneyUsd(payment)}</span>
          </div>
          <div className="flex justify-between">
            <span>Fee</span>
            <span>{formatMoneyUsd(fee)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--blue)]/20 pt-2 font-bold">
            <span>Total</span>
            <span>{formatMoneyUsd(total)}</span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        This payment is {statusLabel(item.status)}
        {item.status === "posted" ? "." : " and will update when the status changes."} Thank you for banking with{" "}
        <BrandText />.
      </p>
    </article>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="shrink-0 text-sm text-[var(--muted)]">{label}</dt>
      <dd className="min-w-0 max-w-[65%] break-words text-right text-sm text-[var(--ink)]">{children}</dd>
    </div>
  );
}
