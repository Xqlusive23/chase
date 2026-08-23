import { receiptHeadline, receiptSubcopy, statusLabel } from "./activity";
import { EMAIL_BLUE, emailContactCta, emailHeader, emailShell } from "./email-layout";
import { formatLongDate, formatMoney, shortId } from "./format";
import type { TransferNotice } from "./notify-transfer";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(name: string) {
  return name.trim().split(/\s+/).filter(Boolean)[0] || "there";
}

function safeDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return formatLongDate(new Date());
  return formatLongDate(date);
}

export function p2pEmailHtml(notice: TransferNotice, supportUrl: string) {
  const amount = escapeHtml(formatMoney(notice.amount));
  const sender = escapeHtml(notice.senderName);
  const brand = escapeHtml(notice.brandName);
  const status = escapeHtml(statusLabel(notice.status));
  const date = escapeHtml(safeDate(notice.date));
  const txn = escapeHtml(shortId(notice.transactionId));
  const contact = notice.supportHref || supportUrl;
  const greeting = escapeHtml(firstName(notice.recipientName));
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(notice.senderName || "You")}&background=0B5CAB&color=fff&bold=true&size=128&format=png`;
  const memo = notice.memo?.trim() ? escapeHtml(notice.memo.trim()) : "";
  const headline = escapeHtml(receiptHeadline(notice.status));
  const subcopy = escapeHtml(receiptSubcopy(notice.status));

  const body = `
    <p style="margin:0;font-size:16px;line-height:1.5;color:#334155;">Hi ${greeting},</p>
    <p style="margin:8px 0 0;font-size:16px;line-height:1.5;color:#334155;">You received money.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr>
        <td align="center">
          <img src="${escapeHtml(avatar)}" alt="${sender}" width="72" height="72" style="display:block;margin:0 auto;width:72px;height:72px;border-radius:36px;border:0;" />
          <p style="margin:16px 0 0;font-size:15px;color:#64748b;">${sender} sent you</p>
          <p style="margin:8px 0 0;font-size:40px;line-height:1.1;font-weight:700;color:#0b1f3a;letter-spacing:-0.03em;">${amount}</p>
          ${
            memo
              ? `<p style="margin:14px 0 0;font-size:16px;line-height:1.4;color:#334155;font-style:italic;">&ldquo;${memo}&rdquo;</p>`
              : ""
          }
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f8fafc" style="margin-top:28px;background-color:#f8fafc;border-radius:16px;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0;font-size:16px;font-weight:700;color:#0b1f3a;">${headline}</p>
          <p style="margin:6px 0 0;font-size:14px;color:#64748b;">${subcopy}</p>
          <p style="margin:16px 0 0;font-size:13px;color:#64748b;">${date}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Status: ${status}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Ref ${txn}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td align="center">
          ${emailContactCta(contact, "center")}
        </td>
      </tr>
    </table>
  `;

  const footer = `This payment notice was sent by ${brand}. If you did not expect this, tap Contact us.`;

  return emailShell(
    emailHeader("You received money", notice.brandName, notice.brandNameCid, notice.brandMarkCid, EMAIL_BLUE),
    body,
    footer,
    EMAIL_BLUE
  );
}
