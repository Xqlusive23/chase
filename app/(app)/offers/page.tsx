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
        <Link href="/cards" className="soft-card overflow-hidden">
          <div className="bg-[#0d1524] px-6 py-5">
            <img src="/assets/chise-credit-card.png" alt="" className="mx-auto h-40 w-auto object-contain" />
          </div>
          <div className="p-5">
            <h2 className="text-xl font-bold">
              <BrandText /> Credit
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">See your card, lock it, or review recent charges.</p>
          </div>
        </Link>
        <Link href="/loans" className="soft-card p-5">
          <h2 className="text-xl font-bold">Auto and personal loans</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Review an auto loan or apply for another product.</p>
        </Link>
      </div>
    </div>
  );
}
