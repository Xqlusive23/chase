import { BackLink } from "../../../components/BackLink";

const FAQS = [
  { q: "How do I deposit a check?", a: "Open Mobile deposit, snap the front of the check, then snap the back." },
  { q: "How do I freeze a card?", a: "Open Cards and tap Freeze card." },
  { q: "Where do deposits and withdrawals show?", a: "Open Plan & track. Deposits are green. Withdrawals are red." },
  { q: "Can I change my registered name?", a: "No. Only an admin can change the name used at registration." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink href="/profile" label="Settings" />
      <h1 className="page-title">FAQ & help</h1>
      <div className="soft-card space-y-4 p-5">
        {FAQS.map((item) => (
          <div key={item.q}>
            <p className="font-semibold">{item.q}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
