"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, type ReactNode, type TouchEvent } from "react";
import { useBank } from "../lib/bank-context";
import { APP_TABS, isSwipeablePath, tabIndex } from "../lib/nav";
import { signOut } from "../lib/session";
import { Avatar } from "./Avatar";
import { IconChart, IconMessages, IconPay, IconPlan, IconPlus, IconStar, IconWallet } from "./Icons";
import { Logo } from "./Logo";
import { PageTransition } from "./PageTransition";

const TAB_ICONS = [IconWallet, IconPay, IconPlan, IconStar, IconChart];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useBank();
  const start = useRef<{ x: number; y: number } | null>(null);

  function handleSignOut() {
    signOut();
    router.replace("/");
  }

  function tabActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/accounts");
    if (href === "/payments") {
      return (
        pathname === "/payments" ||
        pathname.startsWith("/payments/") ||
        pathname === "/send" ||
        pathname === "/transfer" ||
        pathname === "/ach" ||
        pathname === "/wire" ||
        pathname === "/deposit" ||
        pathname === "/bills"
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    if (window.innerWidth >= 1024 || !isSwipeablePath(pathname)) return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, select, textarea, label, [data-no-swipe]")) return;
    start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (!start.current) return;
    const dx = event.changedTouches[0].clientX - start.current.x;
    const dy = event.changedTouches[0].clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    const index = tabIndex(pathname);
    if (index < 0) return;
    if (dx < 0 && index < APP_TABS.length - 1) router.push(APP_TABS[index + 1].href);
    if (dx > 0 && index > 0) router.push(APP_TABS[index - 1].href);
  }

  return (
    <div className="min-h-screen bg-[var(--page)] pb-24 text-[var(--ink)] lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 text-[var(--blue)]">
            <Link href="/support" aria-label="Messages">
              <IconMessages />
            </Link>
            <Link href="/payments" aria-label="Add a product" className="hidden sm:inline-flex">
              <IconPlus />
            </Link>
          </div>
          <Logo href="/dashboard" />
          <Link href="/profile" className="relative" aria-label="Profile">
            <Avatar name={state.displayName} src={state.avatar} size="sm" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--blue)]" />
          </Link>
        </div>
        <nav className="mx-auto hidden max-w-6xl items-center gap-1 px-4 pb-2 lg:flex">
          {APP_TABS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm ${
                tabActive(item.href)
                  ? "bg-[var(--sky)] font-semibold text-[var(--blue)]"
                  : "text-[var(--navy)] hover:bg-[var(--page)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button onClick={handleSignOut} className="ml-auto text-sm font-semibold text-[var(--blue)]">
            Sign out
          </button>
        </nav>
      </header>

      <main
        className="mx-auto max-w-6xl px-4 py-5 lg:py-8"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <PageTransition>{children}</PageTransition>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 overscroll-none border-t border-[var(--line)] bg-white lg:hidden"
        onTouchMove={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-5">
          {APP_TABS.map((item, index) => {
            const Icon = TAB_ICONS[index];
            const active = tabActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-center text-[10px] leading-tight ${
                  active ? "font-semibold text-[var(--blue)]" : "text-[var(--blue)]/70"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
