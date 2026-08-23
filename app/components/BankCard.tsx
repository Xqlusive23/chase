"use client";

import { labeledCardName } from "../lib/brand";
import { cardCvv, cardPan } from "../lib/format";
import type { Card } from "../lib/types";
import { useBrand } from "./BrandProvider";
import { BrandText } from "./BrandText";

export function BankCard({ card, revealed = false }: { card: Card; revealed?: boolean }) {
  const { brand } = useBrand();
  const number = revealed ? cardPan(card.last4, card.pan) : `•••• •••• •••• ${card.last4}`;
  const credit = card.type === "credit";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl text-white shadow-xl ${
        credit
          ? "bg-gradient-to-br from-[#071633] via-[#0d3b7a] to-[#0b5cab]"
          : "bg-gradient-to-br from-[#101820] via-[#1a3348] to-[#24556f]"
      }`}
    >
      <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 left-16 h-44 w-44 rounded-full bg-white/5" />
      <div className="relative aspect-[1.586/1] p-5 sm:p-6">
        {card.locked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-lg font-bold">
            Frozen
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {brand.logo ? (
              <img src={brand.logo} alt="" className="mb-2 h-8 w-8 rounded object-contain" />
            ) : null}
            <p className="truncate text-sm font-semibold tracking-wide">
              <BrandText of={labeledCardName(card.name, card.type, brand.name)} />
            </p>
          </div>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {credit ? "Credit" : "Debit"}
          </p>
        </div>
        <div className="mt-7 h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner" />
        <p className="mt-6 font-mono text-xl tracking-[0.16em] sm:text-2xl">{number}</p>
        <div className="mt-5 flex items-end justify-between gap-4 text-sm">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-white/60">Cardholder</p>
            <p className="truncate font-medium">{card.holder}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wide text-white/60">
              {revealed ? "Expires · CVV" : "Expires"}
            </p>
            <p className="font-medium">
              {revealed ? `${card.expires} · ${cardCvv(card.cvv, card.last4)}` : card.expires}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
