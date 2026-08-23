import { receiptHeadline, receiptSubcopy, statusLabel } from "./activity";
import { EMAIL_BLUE, emailContactCta, emailHeader, emailShell } from "./email-layout";
import { formatLongDate, formatMoney, shortId } from "./format";
import type { TransferNotice } from "./notify-transfer";
import { fillP2pHtml, firstNameFrom, normalizeP2pEmail } from "./p2p-template";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return formatLongDate(new Date());
  return formatLongDate(date);
}

export function p2pEmailHtml(notice: TransferNotice, supportUrl: string) {
  const template = normalizeP2pEmail(notice.p2pEmail);
  const amount = formatMoney(notice.amount);
  const status = statusLabel(notice.status);
  const date = safeDate(notice.date);
  const txn = shortId(notice.transactionId);
  const vars = {
    sender: notice.senderName,
    recipient: notice.recipientName,
    firstName: firstNameFrom(notice.recipientName),
    amount,
    memo: notice.memo?.trim() || "",
    brand: notice.brandName,
    date,
    status,
    ref: txn,
  };
  const sender = escapeHtml(notice.senderName);
  const contact = notice.supportHref || supportUrl;
  const headerColor = template.headerColor || EMAIL_BLUE;
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(notice.senderName || "You")}&background=${headerColor.replace("#", "")}&color=fff&bold=true&size=128&format=png`;
  const memo = notice.memo?.trim() ? escapeHtml(notice.memo.trim()) : "";
  const headline = escapeHtml(receiptHeadline(notice.status));
  const subcopy = escapeHtml(receiptSubcopy(notice.status));
  const intro = fillP2pHtml(template.intro, vars)
    .split(/\n+/)
    .map((line, index) => `<p style="margin:${index === 0 ? "0" : "8px 0 0"};font-size:16px;line-height:1.5;color:#334155;">${line}</p>`)
    .join("");

  const body = `
    ${intro}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr>
        <td align="center">
          <img src="${escapeHtml(avatar)}" alt="${sender}" width="72" height="72" style="display:block;margin:0 auto;width:72px;height:72px;border-radius:36px;border:0;" />
          <p style="margin:16px 0 0;font-size:15px;color:#64748b;">${fillP2pHtml(template.amountLine, vars)}</p>
          <p style="margin:8px 0 0;font-size:40px;line-height:1.1;font-weight:700;color:#0b1f3a;letter-spacing:-0.03em;">${escapeHtml(amount)}</p>
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
          <p style="margin:16px 0 0;font-size:13px;color:#64748b;">${escapeHtml(date)}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Status: ${escapeHtml(status)}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Ref ${escapeHtml(txn)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td align="center">
          ${
            template.contactNote.trim()
              ? `<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#334155;text-align:left;">${fillP2pHtml(template.contactNote, vars).replace(/\n/g, "<br />")}</p>`
              : ""
          }
          ${emailContactCta(contact, "center")}
        </td>
      </tr>
    </table>
  `;

  return emailShell(
    emailHeader(fillP2pHtml(template.eyebrow, vars), notice.brandName, notice.brandNameCid, notice.brandMarkCid, headerColor),
    body,
    fillP2pHtml(template.footer, vars),
    headerColor
  );
}
