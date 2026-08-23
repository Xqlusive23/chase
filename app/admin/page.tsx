"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandText } from "../components/BrandText";
import { loadBank } from "../lib/bank-store";
import { listMembers } from "../lib/users";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ members: 0, open: 0, hold: 0, posted: 0 });

  useEffect(() => {
    const members = listMembers();
    let open = 0;
    let hold = 0;
    let posted = 0;
    for (const user of members) {
      const bank = loadBank(user.username);
      open += bank.transactions.filter((item) => item.status === "pending" || item.status === "processing").length;
      hold += bank.transactions.filter((item) => item.status === "hold").length;
      posted += bank.transactions.filter((item) => item.status === "posted").length;
    }
    setStats({ members: members.length, open, hold, posted });
  }, []);

  const cards = [
    { href: "/admin/members", label: "Members", value: stats.members },
    { href: "/admin/transfers", label: "Open transfers", value: stats.open },
    { href: "/admin/transfers", label: "On hold", value: stats.hold },
    { href: "/admin/transfers", label: "Posted", value: stats.posted },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Overview</h1>
        <p className="page-sub">
          Manage <BrandText /> members, payment holds, and branding from this console.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="panel p-5">
            <p className="text-sm text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--navy)]">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-semibold text-[var(--navy)]">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/admin/new" className="btn-primary text-center">Create member</Link>
            <Link href="/admin/transfers" className="btn-secondary text-center">Review transfers</Link>
            <Link href="/admin/branding" className="btn-secondary text-center">Change logo and name</Link>
            <Link href="/admin/account" className="btn-secondary text-center">Change admin login</Link>
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="font-semibold text-[var(--navy)]">Site identity</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Public pages currently show:</p>
          <p className="mt-3 text-2xl font-bold text-[var(--navy)]">
            <BrandText />
          </p>
          <Link href="/admin/branding" className="mt-4 inline-flex text-sm font-semibold text-[var(--blue)]">
            Edit branding
          </Link>
        </section>
      </div>
    </div>
  );
}
