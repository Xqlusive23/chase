import { emailHeader, emailShell } from "./email-layout";

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
  const button =
    !pending && notice.loginHref
      ? `<a href="${escapeHtml(notice.loginHref)}" style="display:inline-block;margin-top:16px;background-color:#0b5cab;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:8px;">Sign in</a>`
      : "";
  const htmlBody = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${colors.bg}" style="background-color:${colors.bg};border-left:4px solid ${colors.border};border-radius:10px;">
      <tr>
        <td style="padding:16px 18px;color:${colors.text};">
          <p style="margin:0;font-size:18px;font-weight:700;color:${colors.text};">${title}</p>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#334155;">${body}</p>
    ${button}
  `;
  const footer = `This notice was sent by ${brand}.${
    notice.intendedRecipient ? ` Originally addressed to ${escapeHtml(notice.intendedRecipient)}.` : ""
  }`;

  return emailShell(emailHeader("Account notice", notice.brandName, notice.brandNameCid), htmlBody, footer);
}
