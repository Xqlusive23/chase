import { defaultPreferences } from "./activity";
import { DEFAULT_BRAND, applyBrandName, readBrand } from "./brand";
import { seedCards } from "./cards";
import type { BankState, Loan, Transaction } from "./types";

function brandName() {
  return readBrand().name || DEFAULT_BRAND.name;
}

export const STORAGE_PREFIX = "northline_bank_";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function prettyName(username: string) {
  const cleaned = username.replace(/[0-9_]+/g, " ").trim();
  if (!cleaned) return "Member";
  return cleaned
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function seedBank(username: string): BankState {
  const checkingId = "acc_checking";
  const savingsId = "acc_savings";
  const creditId = "acc_credit";

  return {
    displayName: prettyName(username),
    email: "",
    phone: "",
    address: "",
    billingAddress: "",
    transferPin: "",
    accountHold: false,
    support: { channel: "email", value: "" },
    linkedAccounts: [],
    preferences: defaultPreferences(),
    accounts: [
      {
        id: checkingId,
        name: "Everyday Checking",
        type: "checking",
        number: "18439276",
        balance: 4280.44,
      },
      {
        id: savingsId,
        name: "Growth Savings",
        type: "savings",
        number: "22941803",
        balance: 12950,
      },
      {
        id: creditId,
        name: `${brandName()} Card`,
        type: "credit",
        number: "55190214",
        balance: -842.18,
      },
    ],
    transactions: [
      { id: id("txn"), accountId: checkingId, description: "Direct deposit — Payroll", category: "Income", amount: 2480, date: daysAgo(2), status: "posted", applied: true },
      { id: id("txn"), accountId: checkingId, description: "Harbor Market", category: "Groceries", amount: -64.22, date: daysAgo(1), status: "posted", applied: true },
    ],
    bills: [
      { id: id("bill"), payee: "Lumen Electric", amount: 96.15, dueDate: daysFromNow(4), status: "due" },
      { id: id("bill"), payee: "Harbor Internet", amount: 64.99, dueDate: daysFromNow(9), status: "due" },
      { id: id("bill"), payee: "City Water", amount: 41.2, dueDate: daysFromNow(14), status: "due" },
    ],
    cards: seedCards(prettyName(username)),
    deposits: [],
    wires: [],
    achs: [],
    loans: defaultLoans(),
  };
}

function defaultLoans(): Loan[] {
  return [
    {
      id: "loan_auto",
      name: "Auto loan",
      type: "auto",
      principal: 18400,
      balance: 11240,
      rate: 5.9,
      monthlyPayment: 312.18,
      nextDue: daysFromNow(12),
      status: "current",
    },
  ];
}

export function listBankUsernames() {
  if (typeof window === "undefined") return [];
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .map((key) => key.slice(STORAGE_PREFIX.length));
}

export function findBankUsername(identifier: string) {
  const needle = identifier.trim().toLowerCase();
  return listBankUsernames().find((name) => name.toLowerCase() === needle);
}

function defaultCreditAccount() {
  return {
    id: "acc_credit",
    name: `${brandName()} Card`,
    type: "credit" as const,
    number: "55190214",
    balance: -842.18,
  };
}

function defaultCreditCard(holder: string) {
  return {
    id: "card_credit",
    name: `${brandName()} Credit`,
    last4: "0214",
    holder,
    expires: "11/27",
    locked: false,
    type: "credit" as const,
  };
}

function normalizeBank(state: BankState): BankState {
  const accounts = state.accounts.some((account) => account.type === "credit")
    ? state.accounts
    : [...state.accounts, defaultCreditAccount()];
  const cards = state.cards ?? [];
  return {
    ...state,
    preferences: { ...defaultPreferences(), ...state.preferences },
    email: state.email ?? "",
    phone: state.phone ?? "",
    address: state.address ?? "",
    billingAddress: state.billingAddress ?? state.address ?? "",
    transferPin: state.transferPin ?? "",
    accountHold: state.accountHold ?? false,
    accountActivityStatus: state.accountActivityStatus,
    support: state.support ?? { channel: "email", value: "" },
    linkedAccounts: state.linkedAccounts ?? [],
    accounts: accounts.map((account) => ({
      ...account,
      name: applyBrandName(account.name, brandName()),
    })),
    cards: (cards.some((card) => card.type === "credit") ? cards : [...cards, defaultCreditCard(state.displayName)]).map(
      (card) => ({
        ...card,
        name: applyBrandName(card.name, brandName()),
      })
    ),
    transactions: state.transactions.map((item) => ({
      ...item,
      status: item.status ?? "posted",
      applied: item.applied ?? true,
    })) as Transaction[],
    deposits: state.deposits ?? [],
    wires: state.wires ?? [],
    achs: state.achs ?? [],
    loans: state.loans ?? defaultLoans(),
  };
}

export function loadBank(username: string): BankState {
  const storedName = findBankUsername(username) ?? username;
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${storedName}`);
  if (!raw) {
    const seeded = seedBank(username);
    saveBank(username, seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as BankState;
    const normalized = normalizeBank(parsed);
    const missingCredit = !parsed.accounts?.some((account) => account.type === "credit");
    if (missingCredit || parsed.deposits == null || parsed.cards == null) {
      saveBank(storedName, normalized);
    }
    return normalized;
  } catch {
    const seeded = seedBank(username);
    saveBank(username, seeded);
    return seeded;
  }
}

export function saveBank(username: string, state: BankState) {
  const storedName = findBankUsername(username) ?? username;
  localStorage.setItem(`${STORAGE_PREFIX}${storedName}`, JSON.stringify(state));
}
