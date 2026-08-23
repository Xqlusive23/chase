import { receiptHeadline, receiptSubcopy, statusLabel } from "./activity";
import { publicBankLogoUrl } from "./email-images";
import { formatLongDate, formatMoneyUsd, shortId } from "./format";
import type { TransferNotice } from "./notify-transfer";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusColors(status: TransferNotice["status"]) {
  if (status === "hold") return { bg: "#fff4e8", border: "#c2410c", text: "#9a3412" };
  if (status === "pending") return { bg: "#fff7ed", border: "#d97706", text: "#9a3412" };
  if (status === "processing") return { bg: "#e8f2fc", border: "#1366d6", text: "#0b4f9c" };
  return { bg: "#ecfdf5", border: "#0f766e", text: "#115e59" };
}

function methodLabel(notice: TransferNotice) {
  if (notice.transferType === "wire") return "Wire transfer";
  if (notice.transferType === "ach") return "ACH transfer";
  if (notice.transferType === "bill") return "Bill pay";
  if (notice.transferType === "deposit") return "Mobile deposit";
  return "Transfer";
}

function safeDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return formatLongDate(new Date());
  return formatLongDate(date);
}

export function transferEmailHtml(notice: TransferNotice, supportUrl: string) {
  const status = statusLabel(notice.status);
  const amount = formatMoneyUsd(notice.amount);
  const colors = statusColors(notice.status);
  const brand = escapeHtml(notice.brandName);
  const recipient = escapeHtml(notice.recipientName);
  const sender = escapeHtml(notice.senderName);
  const bank = escapeHtml(notice.bankName || "Receiving bank");
  const date = escapeHtml(safeDate(notice.date));
  const txn = escapeHtml(shortId(notice.transactionId));
  const routing = notice.routingNumber ? escapeHtml(notice.routingNumber) : "";
  const contact = notice.supportHref || supportUrl;
  const contactLabel = escapeHtml(notice.supportLabel || "Contact support");
  const fee = notice.fee ? formatMoneyUsd(notice.fee) : "";
  const bankSrc = escapeHtml(notice.bankLogo || publicBankLogoUrl(notice.bankName));
  const header = notice.brandNameCid
    ? `<img src="cid:${notice.brandNameCid}" alt="${brand}" width="200" style="display:block;border:0;max-width:220px;width:200px;height:auto;" />`
    : `<h1 style="margin:6px 0 0;font-size:26px;line-height:1.2;">${brand}</h1>`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#111111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:94%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e8ee;">
            <tr>
              <td style="background:#002e6d;padding:22px 28px;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.75;">Transfer notice</p>
                <div style="margin-top:10px;">${header}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.bg};border-left:4px solid ${colors.border};border-radius:10px;">
                  <tr>
                    <td style="padding:16px 18px;color:${colors.text};">
                      <p style="margin:0;font-size:18px;font-weight:700;">${escapeHtml(receiptHeadline(notice.status))}</p>
                      <p style="margin:6px 0 0;font-size:14px;">${escapeHtml(receiptSubcopy(notice.status))}</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:14px;color:#717171;">${sender} sent</p>
                <p style="margin:4px 0 0;font-size:36px;font-weight:700;color:#0b1f3a;">${amount}</p>
                <p style="margin:6px 0 0;font-size:14px;color:#717171;">${escapeHtml(methodLabel(notice))} · ${escapeHtml(status)}</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border:1px solid #e4e8ee;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <img src="${bankSrc}" alt="${bank}" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:10px;border:1px solid #e4e8ee;background:#ffffff;" />
                      <p style="margin:12px 0 0;font-size:12px;color:#717171;text-transform:uppercase;letter-spacing:0.06em;">Recipient bank</p>
                      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#0b1f3a;">${bank}</p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#717171;">To</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#111111;text-align:right;font-weight:600;">${recipient}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#717171;">Date</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#111111;text-align:right;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#717171;">Transaction ID</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#111111;text-align:right;">${txn}</td>
                  </tr>
                  ${
                    routing
                      ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#717171;">Routing number</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#111111;text-align:right;">${routing}</td>
                  </tr>`
                      : ""
                  }
                  ${
                    fee
                      ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#717171;">Fee</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#111111;text-align:right;">${fee}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:12px 0;font-size:14px;color:#717171;">Status</td>
                    <td style="padding:12px 0;font-size:14px;color:${colors.text};text-align:right;font-weight:700;">${escapeHtml(status)}</td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#e7f1fb;border-radius:12px;">
                  <tr>
                    <td style="padding:20px;">
                      <p style="margin:0;font-size:16px;font-weight:700;color:#0b1f3a;">Need help?</p>
                      <p style="margin:8px 0 0;font-size:14px;line-height:1.5;color:#334155;">If you have a question about this transfer, or you did not expect this payment, contact support and we will look into it.</p>
                      ${
                        contact
                          ? `<a href="${escapeHtml(contact)}" style="display:inline-block;margin-top:16px;background:#0b5cab;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:8px;">${contactLabel}</a>`
                          : `<p style="margin:16px 0 0;font-size:14px;font-weight:700;color:#0b5cab;">${contactLabel}</p>`
                      }
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-size:12px;line-height:1.6;color:#717171;">
                This notice was sent by ${brand} because a transfer was addressed to you.
                ${notice.intendedRecipient ? ` Originally addressed to ${escapeHtml(notice.intendedRecipient)}.` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
