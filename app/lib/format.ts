export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatMoneyUsd(amount: number) {
  return `${formatMoney(amount)} USD`;
}

export function formatReceiptStamp(value: string) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
  return `${day} | ${time}`;
}

export function shortId(id: string) {
  return id.replace(/[^a-z0-9]/gi, "").slice(-10) || id.slice(-10);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocal(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "CB";
}

export function maskAccount(number: string) {
  return `(...${number.slice(-4)})`;
}

export function greetingForNow(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatLongDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function accountBalanceLabel(type: string) {
  return type === "credit" ? "Current balance" : "Available balance";
}

export function displayBalance(type: string, balance: number) {
  return type === "credit" ? Math.abs(balance) : balance;
}

export function activityKind(amount: number) {
  return amount >= 0 ? "deposit" : "withdrawal";
}

export function formatSignedMoney(amount: number) {
  const value = formatMoney(Math.abs(amount));
  if (amount > 0) return `+${value}`;
  if (amount < 0) return `-${value}`;
  return value;
}

export function hiddenBalance() {
  return "••••••";
}

export function cardPan(last4: string, pan?: string) {
  if (pan) return pan.replace(/(.{4})/g, "$1 ").trim();
  return `4738 0000 0000 ${last4}`;
}

export function cardCvv(cvv?: string, last4?: string) {
  return cvv || last4?.slice(-3) || "184";
}
