"use client";

import { useState } from "react";
import { BackLink } from "../../components/BackLink";
import { BankCard } from "../../components/BankCard";
import { useBank } from "../../lib/bank-context";
import { removeCard } from "../../lib/bank-store";

export default function CardsPage() {
  const { state, update } = useBank();
  const [openId, setOpenId] = useState<string | null>(null);

  function toggleFreeze(cardId: string) {
    update((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === cardId ? { ...card, locked: !card.locked } : card
      ),
    }));
  }

  return (
    <div className="space-y-5">
      <BackLink href="/dashboard" label="Dashboard" />
      <div>
        <h1 className="page-title">Cards</h1>
        <p className="page-sub">Freeze a card if it is misplaced. Show details only when you need the number.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {state.cards.map((card) => (
          <div key={card.id} className="space-y-3">
            <BankCard card={card} revealed={openId === card.id} />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => toggleFreeze(card.id)} className="btn-secondary">
                {card.locked ? "Unfreeze card" : "Freeze card"}
              </button>
              <button
                onClick={() => setOpenId((current) => (current === card.id ? null : card.id))}
                className="btn-secondary"
              >
                {openId === card.id ? "Hide details" : "Show details"}
              </button>
              <button
                onClick={() => {
                  if (!confirm("Remove this card?")) return;
                  update((current) => removeCard(current, card.id));
                  setOpenId((current) => (current === card.id ? null : current));
                }}
                className="btn-secondary col-span-2 text-red-700"
              >
                Delete card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
