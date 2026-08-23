"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "../lib/session";
import { Logo } from "./Logo";
import { PageTransition } from "./PageTransition";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/new", label: "Create member" },
  { href: "/admin/transfers", label: "Transfers" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/account", label: "Admin account" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  function active(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/admin/members") {
      return pathname.startsWith("/admin/members") || pathname.startsWith("/admin/users") || pathname.startsWith("/admin/receipt");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-[var(--page)] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={`z-40 bg-[var(--navy)] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col ${open ? "fixed inset-0" : "hidden lg:flex"}`}>
        <div className="flex items-center justify-between px-5 py-5">
          <Logo href="/admin" light />
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>
        <p className="px-5 text-xs uppercase tracking-[0.16em] text-white/50">Administration</p>
        <nav className="mt-3 flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm ${
                active(item.href, item.exact) ? "bg-white/15 font-semibold" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button onClick={handleSignOut} className="w-full rounded bg-[var(--blue)] px-3 py-2 text-sm font-semibold">
            Sign out
          </button>
        </div>
      </aside>

      <div>
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--line)] bg-white px-4 py-3 lg:px-8">
          <button type="button" className="font-semibold text-[var(--navy)] lg:hidden" onClick={() => setOpen(true)}>
            Menu
          </button>
          <p className="text-sm text-[var(--muted)]">Control members, payment status, and site branding</p>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
