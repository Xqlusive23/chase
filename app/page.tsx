import Link from "next/link";
import { BrandText } from "./components/BrandText";
import { Logo } from "./components/Logo";

const PRODUCTS = [
  {
    title: "Checking",
    body: "A daily account for deposits, debit spending, and transfers between your accounts.",
  },
  {
    title: "Savings",
    body: "Set money aside and move funds in a few taps. Balances update as soon as the transfer posts.",
  },
  {
    title: "Credit cards",
    body: "Review a sample card balance, lock the card, and see charges in your activity list.",
  },
  {
    title: "Pay & transfer",
    body: "Send money between accounts, pay a bill, or try an external recipient — all stored locally.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-[var(--navy)] md:flex">
            <a href="#products" className="hover:underline">
              Products
            </a>
            <a href="#banking" className="hover:underline">
              Online banking
            </a>
            <a href="#help" className="hover:underline">
              Help
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="hidden text-sm text-[var(--navy)] hover:underline sm:inline">
              Sign up
            </Link>
            <Link href="/login" className="rounded bg-[var(--blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--blue-hover)]">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#d7e8f8] text-[var(--navy)]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-2 md:py-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">Personal banking</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
              Bank from anywhere, with a clear view of your money.
            </h1>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              <BrandText /> gives you a clear view of checking, savings, cards, and transfers. Create an account
              or sign in to manage activity.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded bg-[var(--blue)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--blue-hover)]">
                Create an account
              </Link>
              <Link href="/login" className="rounded border border-[var(--navy)] px-5 py-2.5 font-semibold text-[var(--navy)]">
                Sign in
              </Link>
              <a href="#products" className="rounded border border-[var(--blue)]/40 px-5 py-2.5 font-semibold text-[var(--navy)]">
                Explore products
              </a>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 text-[var(--ink)] shadow-xl">
            <p className="text-sm font-semibold text-[var(--blue)]">Account snapshot</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--navy)]">Everyday Checking</h2>
            <p className="mt-4 text-3xl font-semibold text-[var(--navy)]">$4,280.44</p>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between border-b border-[var(--line)] py-2">
                <span>Growth Savings</span>
                <span className="font-medium">$12,950.00</span>
              </div>
              <div className="flex justify-between border-b border-[var(--line)] py-2">
                <span>Credit card</span>
                <span className="font-medium">$842.18</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Upcoming bills</span>
                <span className="font-medium">3 due</span>
              </div>
            </div>
            <Link href="/signup" className="btn-primary mt-6 inline-flex w-full justify-center">
              Open an account
            </Link>
          </div>
        </div>
      </section>

      <section id="products" className="bg-[var(--page)]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="page-title">Products</h2>
          <p className="page-sub">The same kinds of tools you would expect from a retail bank.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <article key={product.title} className="panel p-5">
                <div className="mb-3 h-1 w-10 bg-[var(--blue)]" />
                <h3 className="text-lg font-semibold text-[var(--navy)]">{product.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{product.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="banking" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="page-title">Online banking</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article>
              <h3 className="font-semibold text-[var(--navy)]">See every account</h3>
              <p className="mt-2 text-[var(--muted)]">Checking, savings, and card balances sit together on one dashboard.</p>
            </article>
            <article>
              <h3 className="font-semibold text-[var(--navy)]">Follow activity</h3>
              <p className="mt-2 text-[var(--muted)]">Search deposits, purchases, and transfers the way a bank activity page would.</p>
            </article>
            <article>
              <h3 className="font-semibold text-[var(--navy)]">Move money</h3>
              <p className="mt-2 text-[var(--muted)]">Transfers and bill pay update your balances as soon as they post.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="help" className="bg-[var(--navy)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-semibold">Banking with <BrandText light />.</h2>
          <p className="mt-3 max-w-3xl text-white/75">
            Create an account, follow activity from pending to posted, or sign in to manage payments and transfers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex rounded bg-[var(--blue)] px-5 py-2.5 font-semibold">
              Sign up
            </Link>
            <Link href="/login" className="inline-flex rounded border border-white/40 px-5 py-2.5 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white py-6 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} <BrandText />. All rights reserved.
      </footer>
    </div>
  );
}
