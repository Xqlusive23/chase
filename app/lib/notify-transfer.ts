import { bankDisplayName, readBrand } from "./brand";
import { statusLabel } from "./activity";
import { prepareBrandHeaderImage, prepareSenderLogo, publicBankLogoUrl } from "./email-images";
import { formatMoney, formatMoneyUsd } from "./format";
import { fillP2pText, firstNameFrom, normalizeP2pEmail, type P2pEmailTemplate } from "./p2p-template";
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
  memo?: string;
  date?: string;
  supportHref?: string;
  supportLabel?: string;
  intendedRecipient?: string;
  brandNameImage?: string;
  brandLogo?: string;
  brandNameCid?: string;
  brandMarkCid?: string;
  bankLogoCid?: string;
  p2pEmail?: P2pEmailTemplate;
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
    memo: transaction.memo,
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
    const p2pEmail = notice.transferType === "p2p" ? normalizeP2pEmail(notice.p2pEmail || brand.p2pEmail) : undefined;
    const headerNameImage = p2pEmail?.nameImage || notice.brandNameImage || brand.nameImage;
    const brandNameImage = await prepareBrandHeaderImage(headerNameImage, 280, p2pEmail?.nameImage ? "none" : "white");
    const brandLogo = brand.logo ? await prepareSenderLogo(brand.logo, 192) : "";
    const response = await fetch("/api/notify-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...notice,
        brandName: bankDisplayName(notice.brandName || brand.name),
        brandNameImage,
        brandLogo,
        bankName: notice.bankName,
        bankLogo: notice.bankLogo || publicBankLogoUrl(notice.bankName),
        p2pEmail,
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
  if (notice.transferType === "p2p") {
    const sent = formatMoney(notice.amount);
    const template = normalizeP2pEmail(notice.p2pEmail);
    const vars = {
      sender: notice.senderName,
      recipient: notice.recipientName,
      firstName: firstNameFrom(notice.recipientName),
      amount: sent,
      memo: notice.memo?.trim() || "",
      brand: notice.brandName,
      date: notice.date || "",
      status,
      ref: notice.transactionId,
    };
    return {
      subject: fillP2pText(template.subject, vars),
      text: [
        fillP2pText(template.intro, vars),
        "",
        `${fillP2pText(template.amountLine, vars)} ${sent}`.trim(),
        notice.memo ? `Memo: ${notice.memo}` : "",
        `Status: ${status}`,
        `Transaction ID: ${notice.transactionId}`,
        template.contactNote.trim() ? fillP2pText(template.contactNote, vars) : "",
        fillP2pText(template.footer, vars),
        notice.intendedRecipient ? `Intended recipient: ${notice.intendedRecipient}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }
  return {
    subject: `${notice.brandName} transfer ${status}: ${amount}`,
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
