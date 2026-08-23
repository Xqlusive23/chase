export type AccountNotice = {
  to: string;
  displayName: string;
  brandName: string;
  kind: "pending" | "approved";
  brandNameImage?: string;
  brandNameCid?: string;
  intendedRecipient?: string;
  loginHref?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function accountEmailCopy(notice: AccountNotice) {
  const name = notice.displayName || "there";
  if (notice.kind === "pending") {
    return {
      subject: `${notice.brandName} application received`,
      text: [
        `Hi ${name},`,
        "",
        `We received your ${notice.brandName} application. It is pending review and you cannot sign in yet.`,
        "You will get another email if the account is approved.",
        notice.intendedRecipient ? `Intended recipient: ${notice.intendedRecipient}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }
  return {
    subject: `${notice.brandName} account approved`,
    text: [
      `Hi ${name},`,
      "",
      `Your ${notice.brandName} application was approved. You can sign in now.`,
      notice.loginHref || "",
      notice.intendedRecipient ? `Intended recipient: ${notice.intendedRecipient}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export function accountEmailHtml(notice: AccountNotice) {
  const brand = escapeHtml(notice.brandName);
  const name = escapeHtml(notice.displayName || "there");
  const pending = notice.kind === "pending";
  const colors = pending
    ? { bg: "#fff7ed", border: "#d97706", text: "#9a3412" }
    : { bg: "#ecfdf5", border: "#0f766e", text: "#115e59" };
  const title = pending ? "Application pending" : "Account approved";
  const body = pending
    ? `Thanks for applying, ${name}. Your account is under review. You will not be able to sign in until an administrator approves it.`
    : `Good news, ${name}. Your ${brand} account is approved. You can sign in and start using your accounts.`;
  const header = notice.brandNameCid
    ? `<img src="cid:${notice.brandNameCid}" alt="${brand}" width="200" style="display:block;border:0;max-width:220px;width:200px;height:auto;" />`
    : `<h1 style="margin:6px 0 0;font-size:26px;line-height:1.2;">${brand}</h1>`;
  const button =
    !pending && notice.loginHref
      ? `<a href="${escapeHtml(notice.loginHref)}" style="display:inline-block;margin-top:16px;background:#0b5cab;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:8px;">Sign in</a>`
      : "";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#111111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:94%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e8ee;">
            <tr>
              <td style="background:#002e6d;padding:22px 28px;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.75;">Account notice</p>
                <div style="margin-top:10px;">${header}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.bg};border-left:4px solid ${colors.border};border-radius:10px;">
                  <tr>
                    <td style="padding:16px 18px;color:${colors.text};">
                      <p style="margin:0;font-size:18px;font-weight:700;">${title}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#334155;">${body}</p>
                ${button}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-size:12px;line-height:1.6;color:#717171;">
                This notice was sent by ${brand}.
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
