import Link from "next/link";
import { BrandText } from "../../components/BrandText";

export default function BenefitsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Benefits & travel</h1>
        <p className="page-sub">
          Perks tied to your <BrandText /> cards.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Link href="/cards" className="soft-card p-5">
          <h2 className="text-xl font-bold">Card benefits</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Review card details, lock a card, or open the card image view.</p>
        </Link>
        <div className="soft-card p-5">
          <h2 className="text-xl font-bold">Travel notice</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Use your cards while you travel. Add a trip notice if you need one.</p>
        </div>
      </div>
    </div>
  );
}
