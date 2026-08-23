import type { Card } from "./types";

function digits(count: number) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 10)).join("");
}

export function randomPan() {
  return `4${digits(15)}`;
}

export function makeCard(type: "debit" | "credit", holder: string): Card {
  const pan = randomPan();
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const year = String(27 + Math.floor(Math.random() * 4));
  return {
    id: `card_${Math.random().toString(36).slice(2, 10)}`,
    name: type === "credit" ? "Credit Card" : "Everyday Debit",
    last4: pan.slice(-4),
    holder,
    expires: `${month}/${year}`,
    locked: false,
    type,
    pan,
    cvv: digits(3),
  };
}

export function seedCards(holder: string): Card[] {
  return [makeCard("debit", holder), makeCard("credit", holder)];
}
