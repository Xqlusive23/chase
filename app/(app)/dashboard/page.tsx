"use client";

import Link from "next/link";
import { AccountGroup } from "../../components/AccountGroup";
import {
  IconBriefcase,
  IconBulb,
  IconChecking,
  IconChevron,
  IconCreditCard,
  IconMoneyIn,
  IconPiggy,
  IconPlus,
} from "../../components/Icons";
import { labeledCardName } from "../../lib/brand";
import { useBank } from "../../lib/bank-context";
import { useBrand } from "../../components/BrandProvider";
import { BrandText } from "../../components/BrandText";
import { formatLongDate, greetingForNow } from "../../lib/format";

const QUICK_ACTIONS = [
  { href: "/payments", label: "+", plus: true },
  { href: "/ach", label: "Send money" },
  { href: "/deposit", label: "Deposit checks" },
  { href: "/bills", label: "Pay bills" },
];

const OPEN_PRODUCTS = [
  { href: "/cards", title: "Credit cards", icon: IconCreditCard },
  { href: "/accounts", title: "Checking", icon: IconChecking },
  { href: "/accounts", title: "Savings & CDs", icon: IconPiggy },
  { href: "/loans", title: "Business", icon: IconBriefcase },
];

export default function DashboardPage() {
  const { state } = useBank();
  const { brand } = useBrand();
  const cashAccounts = state.accounts.filter((account) => account.type !== "credit");
  const creditAccounts = state.accounts.filter((account) => account.type === "credit");
  const latestIn = [...state.transactions]
    .filter((item) => item.amount > 0)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  const creditCard = state.cards.find((card) => card.type === "credit") ?? state.cards[0];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">{greetingForNow()}</h1>
        <p className="mt-1 text-[var(--muted)]">{formatLongDate()}</p>
      </div>

      {state.accountHold && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          This account is on hold. Transfers and payments cannot go through until an admin releases it.
        </div>
      )}

      <div
        data-no-swipe
        className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 touch-pan-x lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
        onTouchMove={(event) => event.stopPropagation()}
      >
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--blue)] bg-white px-4 py-2 text-sm font-semibold text-[var(--blue)]"
          >
            {action.plus && <IconPlus />}
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="space-y-6">
          <div className="soft-card flex items-center gap-3 p-4">
            <span className="shrink-0">
              {latestIn ? <IconMoneyIn /> : <IconBulb />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-bold">{latestIn ? "Snapshot" : "Today's Snapshot"}</h2>
                {latestIn && (
                  <span className="shrink-0 rounded-full bg-[var(--page)] px-2 py-0.5 text-xs text-[var(--muted)]">
                    1 min read
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                {latestIn
                  ? `You got money from ${latestIn.description}.`
                  : "Insights about your money, at-a-glance."}
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Accounts</h2>
              <Link href="/accounts" className="px-2 text-lg text-[var(--muted)]" aria-label="Account options">
                ···
              </Link>
            </div>
            <AccountGroup title="Bank accounts" accounts={cashAccounts} hideBalances={state.preferences?.hideBalances} />
            <AccountGroup title="Credit cards" accounts={creditAccounts} hideBalances={state.preferences?.hideBalances} />
            <Link href="/accounts/link" className="flex items-center justify-between px-1 py-2 text-sm font-semibold text-[var(--ink)]">
              Link external accounts
              <IconChevron className="h-4 w-4 text-[var(--muted)]" />
            </Link>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="soft-card p-5">
            <h2 className="text-lg font-bold">Move money</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Link href="/wire" className="rounded-xl bg-[var(--page)] px-4 py-3 font-semibold text-[var(--navy)]">
                Wire transfer
              </Link>
              <Link href="/ach" className="rounded-xl bg-[var(--page)] px-4 py-3 font-semibold text-[var(--navy)]">
                ACH transfer
              </Link>
              <Link href="/deposit" className="rounded-xl bg-[var(--page)] px-4 py-3 font-semibold text-[var(--navy)]">
                Mobile deposit
              </Link>
              <Link href="/bills" className="rounded-xl bg-[var(--page)] px-4 py-3 font-semibold text-[var(--navy)]">
                Pay bills
              </Link>
            </div>
          </section>
          {creditCard && (
            <Link href="/cards" className="soft-card block overflow-hidden">
              <div className="bg-[#0d1524] px-5 py-6">
                <img
                  src={creditCard.type === "credit" ? "/assets/chise-credit-card.png" : "/assets/chise-debit-card.png"}
                  alt=""
                  className="mx-auto h-40 w-auto max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="font-bold">Your cards</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  <BrandText of={labeledCardName(creditCard.name, creditCard.type, brand.name)} /> ending in {creditCard.last4}
                </p>
                <span className="mt-2 inline-flex text-sm font-semibold text-[var(--blue)]">Open cards</span>
              </div>
            </Link>
          )}
        </aside>
      </div>

      <section>
        <h2 className="mb-3 text-2xl font-bold">Open an account</h2>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {OPEN_PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <Link
                key={product.title}
                href={product.href}
                className="flex flex-col items-center gap-2 py-3 text-center"
              >
                <Icon />
                <span className="text-xs font-semibold text-[var(--blue)] sm:text-sm">{product.title}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
