import Link from "next/link";
import { BrandText } from "../../components/BrandText";

export default function OffersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Offers</h1>
        <p className="page-sub">Current promotions for cards and lending.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Link href="/cards" className="soft-card p-5">
          <h2 className="text-xl font-bold">
            <BrandText /> Credit
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">See your card, lock it, or review recent charges.</p>
        </Link>
        <Link href="/loans" className="soft-card p-5">
          <h2 className="text-xl font-bold">Auto and personal loans</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Review an auto loan or apply for another product.</p>
        </Link>
      </div>
    </div>
  );
}
