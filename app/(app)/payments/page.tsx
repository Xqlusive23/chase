"use client";

import Link from "next/link";
import { BrandText } from "../../components/BrandText";

const TOOLS = [
  { href: "/transfer", title: "Internal transfer", body: "Move money between your accounts." },
  { href: "/ach", title: "ACH transfer", body: "Send or receive an electronic bank-to-bank payment." },
  { href: "/wire", title: "Wire transfer", body: "Send a domestic or international wire with routing and SWIFT details." },
  { href: "/deposit", title: "Mobile deposit", body: "Deposit a check by capturing the front image and amount." },
  { href: "/bills", title: "Bill pay", body: "Pay utilities and other scheduled bills." },
  { href: "/loans", title: "Loans", body: "Review an auto loan and apply for another product." },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Pay & transfer</h1>
        <p className="page-sub">Everyday banking tools for moving money.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="panel p-5 transition-transform duration-200 hover:-translate-y-0.5">
            <h2 className="text-lg font-semibold text-[var(--navy)]">{tool.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <BrandText of={tool.body} />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
