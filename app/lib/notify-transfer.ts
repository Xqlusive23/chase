import { readBrand } from "./brand";
import { statusLabel } from "./activity";
import { prepareBrandHeaderImage, publicBankLogoUrl } from "./email-images";
import { formatMoneyUsd } from "./format";
import { supportHref, supportLabel } from "./support";
import type { ActivityStatus, BankState, Transaction, TransferType } from "./types";

export type TransferNotice = {
  to: string;
  recipientName: string;
  senderName: string;
  amount: number;
  status: ActivityStatus;
  brandName: string;
  transactionId: string;
  bankName?: string;
  bankLogo?: string;
  routingNumber?: string;
  transferType?: TransferType;
  fee?: number;
  date?: string;
  supportHref?: string;
  supportLabel?: string;
  intendedRecipient?: string;
  brandNameImage?: string;
  brandLogo?: string;
  brandNameCid?: string;
  bankLogoCid?: string;
};

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function noticeFromTransaction(
  transaction: Transaction,
  senderName: string,
  brandName: string,
  extras?: { supportHref?: string; supportLabel?: string; brandNameImage?: string; brandLogo?: string }
): TransferNotice | null {
  const to = transaction.recipientEmail?.trim();
  if (!to || !isValidEmail(to)) return null;
  return {
    to,
    recipientName: transaction.recipient || "Recipient",
    senderName,
    amount: Math.abs(transaction.amount) - (transaction.fee ?? 0),
    status: transaction.status,
    brandName,
    transactionId: transaction.id,
    bankName: transaction.recipientBank,
    bankLogo: publicBankLogoUrl(transaction.recipientBank),
    routingNumber: transaction.routingNumber,
    transferType: transaction.transferType,
    fee: transaction.fee,
    date: transaction.date,
    supportHref: extras?.supportHref,
    supportLabel: extras?.supportLabel,
    brandNameImage: extras?.brandNameImage,
    brandLogo: extras?.brandLogo,
  };
}

export function noticeFromBank(
  transaction: Transaction,
  state: Pick<BankState, "displayName" | "support">,
  brandName?: string
) {
  const brand = readBrand();
  return noticeFromTransaction(transaction, state.displayName, brandName || brand.name, {
    supportHref: supportHref(state.support),
    supportLabel: supportLabel(state.support),
    brandNameImage: brand.nameImage,
    brandLogo: brand.logo,
  });
}

export async function notifyTransferEmail(notice: TransferNotice | null) {
  if (!notice) return;
  try {
    const brand = readBrand();
    const brandNameImage = await prepareBrandHeaderImage(notice.brandNameImage || brand.nameImage, 360, "navy");
    const response = await fetch("/api/notify-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...notice,
        brandName: notice.brandName || brand.name,
        brandNameImage,
        brandLogo: notice.brandLogo || brand.logo,
        bankName: notice.bankName,
        bankLogo: notice.bankLogo || publicBankLogoUrl(notice.bankName),
      }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      console.error("Transfer email failed:", payload?.error || response.statusText);
    }
  } catch {
    /* a missing key or network error should not block the transfer */
  }
}

export function transferEmailCopy(notice: TransferNotice) {
  const status = statusLabel(notice.status);
  const amount = formatMoneyUsd(notice.amount);
  return {
    subject: `${notice.brandName} transfer ${status.toLowerCase()}: ${amount}`,
    text: [
      `Hi ${notice.recipientName},`,
      "",
      `${notice.senderName} sent ${amount} through ${notice.brandName}.`,
      `Status: ${status}`,
      notice.bankName ? `Receiving bank: ${notice.bankName}` : "",
      `Transaction ID: ${notice.transactionId}`,
      notice.intendedRecipient ? `Intended recipient: ${notice.intendedRecipient}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
