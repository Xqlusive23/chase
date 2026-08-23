"use client";

import { labeledCardName } from "../lib/brand";
import { cardCvv, cardPan } from "../lib/format";
import type { Card } from "../lib/types";
import { useBrand } from "./BrandProvider";
import { BrandText } from "./BrandText";

export function BankCard({ card, revealed = false }: { card: Card; revealed?: boolean }) {
  const { brand } = useBrand();
  const image = card.type === "credit" ? "/assets/chise-credit-card.png" : "/assets/chise-debit-card.png";
  const number = revealed ? cardPan(card.last4, card.pan) : `•••• •••• •••• ${card.last4}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-[var(--navy)] text-white shadow-xl">
      <div className="relative aspect-[16/9] bg-[#0d1524]">
        <img src={image} alt="" className="h-full w-full object-contain" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {card.locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-bold">
            Frozen
          </div>
        )}
        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-sm text-white/70">
            {card.locked ? "Frozen" : "Active"} · <BrandText of={labeledCardName(card.name, card.type, brand.name)} />
          </p>
          <p className="mt-1 text-xl tracking-[0.12em]">{number}</p>
          <div className="mt-3 flex justify-between text-sm">
            <span>{card.holder}</span>
            <span>{revealed ? `EXP ${card.expires} · CVV ${cardCvv(card.cvv, card.last4)}` : card.expires}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
