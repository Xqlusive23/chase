import type { Account, ActivityStatus, BankState, Transaction } from "./types";

export const ACTIVITY_STATUSES: ActivityStatus[] = ["pending", "processing", "hold", "posted"];

export const ACTIVITY_CATEGORIES = [
  "Income",
  "Transfer",
  "Groceries",
  "Dining",
  "Travel",
  "Shopping",
  "Utilities",
  "Bills",
  "Other",
];

export function defaultPreferences() {
  return {
    hideBalances: false,
    alerts: true,
    paperless: true,
    twoStep: false,
  };
}

export function statusLabel(status: ActivityStatus) {
  if (status === "pending") return "Pending";
  if (status === "processing") return "Processing";
  if (status === "hold") return "Hold";
  return "Posted";
}

export function receiptHeadline(status: ActivityStatus) {
  if (status === "hold") return "Payment on hold";
  if (status === "pending") return "Payment pending";
  if (status === "processing") return "Payment processing";
  return "Payment completed";
}

export function receiptSubcopy(status: ActivityStatus) {
  if (status === "hold") return "This payment is paused pending review.";
  if (status === "pending") return "Your payment is being processed.";
  if (status === "processing") return "Your payment is moving through the network.";
  return "Your payment has posted to the account.";
}

export function mainAccountId(accounts: Account[]) {
  return (
    accounts.find((account) => account.type === "checking")?.id ??
    accounts.find((account) => account.type !== "credit")?.id ??
    accounts[0]?.id ??
    "acc_checking"
  );
}

export function adjustBalance(accounts: Account[], accountId: string, amount: number) {
  return accounts.map((account) =>
    account.id === accountId ? { ...account, balance: Number((account.balance + amount).toFixed(2)) } : account
  );
}

export function setAccountBalance(accounts: Account[], accountId: string, balance: number) {
  return accounts.map((account) =>
    account.id === accountId ? { ...account, balance: Number(balance.toFixed(2)) } : account
  );
}

export function createActivity(
  partial: Omit<Transaction, "id" | "applied"> & { id?: string; applied?: boolean }
): Transaction {
  return {
    ...partial,
    id: partial.id ?? `txn_${crypto.randomUUID()}`,
    applied: partial.applied ?? partial.status === "posted",
  };
}

export function applyTransactionToState(state: BankState, transaction: Transaction): BankState {
  let next = { ...transaction };
  let accounts = state.accounts;
  if (next.status === "posted" && !next.applied) {
    accounts = adjustBalance(accounts, next.accountId, next.amount);
    next = { ...next, applied: true };
  }
  return {
    ...state,
    accounts,
    transactions: [next, ...state.transactions],
  };
}

export function removeTransaction(state: BankState, transactionId: string): BankState {
  const current = state.transactions.find((item) => item.id === transactionId);
  if (!current) return state;
  const accounts = current.applied
    ? adjustBalance(state.accounts, current.accountId, -current.amount)
    : state.accounts;
  return {
    ...state,
    accounts,
    transactions: state.transactions.filter((item) => item.id !== transactionId),
  };
}

export function updateTransaction(
  state: BankState,
  transactionId: string,
  patch: Partial<Omit<Transaction, "id">>
): BankState {
  const current = state.transactions.find((item) => item.id === transactionId);
  if (!current) return state;

  let accounts = state.accounts;
  if (current.applied) {
    accounts = adjustBalance(accounts, current.accountId, -current.amount);
  }

  const next: Transaction = {
    ...current,
    ...patch,
    id: current.id,
    applied: false,
    manualStatus: patch.manualStatus ?? current.manualStatus,
  };

  if (next.status === "posted" || patch.applied) {
    accounts = adjustBalance(accounts, next.accountId, next.amount);
    next.applied = true;
  }

  return {
    ...state,
    accounts,
    transactions: state.transactions.map((item) => (item.id === transactionId ? next : item)),
  };
}

export function advanceActivity(state: BankState): BankState {
  let accounts = state.accounts;
  let changed = false;

  const transactions = state.transactions.map((item) => {
    let next = item;
    if (item.manualStatus || item.status === "hold") return item;
    if (item.status === "pending") {
      next = { ...item, status: "processing" };
      changed = true;
    } else if (item.status === "processing") {
      next = { ...item, status: "posted" };
      changed = true;
    }

    if (next.status === "posted" && !next.applied) {
      accounts = adjustBalance(accounts, next.accountId, next.amount);
      next = { ...next, applied: true };
      changed = true;
    }
    return next;
  });

  if (!changed) return state;
  return {
    ...state,
    accounts,
    transactions,
    achs: syncLinkedStatus(state.achs, transactions),
    wires: syncLinkedStatus(state.wires, transactions),
    deposits: syncLinkedStatus(state.deposits, transactions),
  };
}

function syncLinkedStatus<T extends { id: string; status: ActivityStatus }>(items: T[] | undefined, transactions: Transaction[]): T[] {
  return (items ?? []).map((item) => {
    const match = transactions.find((entry) => entry.id === item.id);
    return match ? { ...item, status: match.status } : item;
  });
}

export function currentAccountStatus(state: BankState): ActivityStatus {
  if (state.accountActivityStatus) return state.accountActivityStatus;
  const first = state.transactions[0]?.status;
  if (first && state.transactions.every((item) => item.status === first)) return first;
  return "pending";
}

export function setAccountActivityStatus(state: BankState, status: ActivityStatus): BankState {
  return state.transactions.reduce<BankState>(
    (current, item) => setTransferStatus(current, item.id, status),
    { ...state, accountActivityStatus: status }
  );
}

export function setTransferStatus(state: BankState, transactionId: string, status: ActivityStatus): BankState {
  const current = state.transactions.find((item) => item.id === transactionId);
  if (!current) return state;

  let accounts = state.accounts;
  let applied = current.applied;

  if (current.status === "posted" && current.applied && status !== "posted") {
    accounts = adjustBalance(accounts, current.accountId, -current.amount);
    applied = false;
  }

  if (status === "posted" && !applied) {
    accounts = adjustBalance(accounts, current.accountId, current.amount);
    applied = true;
  }

  const transactions = state.transactions.map((item) =>
    item.id === transactionId ? { ...item, status, applied, manualStatus: true } : item
  );

  return {
    ...state,
    accounts,
    transactions,
    achs: syncLinkedStatus(state.achs, transactions),
    wires: syncLinkedStatus(state.wires, transactions),
    deposits: syncLinkedStatus(state.deposits, transactions),
  };
}

export function countByStatus(transactions: Transaction[]) {
  return ACTIVITY_STATUSES.reduce(
    (counts, status) => {
      counts[status] = transactions.filter((item) => item.status === status).length;
      return counts;
    },
    { pending: 0, processing: 0, hold: 0, posted: 0 } as Record<ActivityStatus, number>
  );
}
