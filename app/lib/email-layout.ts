export const EMAIL_NAVY = "#002e6d";
export const EMAIL_BLUE = "#0b5cab";
export const EMAIL_ASH = "#b0b4b8";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailHeader(
  eyebrow: string,
  brandName: string,
  brandNameCid?: string,
  _brandMarkCid?: string,
  background = EMAIL_NAVY
) {
  const brand = escapeHtml(brandName);
  const bg = background;
  const fill = `background:${bg};background-color:${bg};background-image:linear-gradient(${bg},${bg});`;
  const title = brandNameCid
    ? `<table role="presentation" width="200" align="center" cellpadding="0" cellspacing="0" border="0" style="width:200px;margin:8px auto 0;">
        <tr>
          <td align="center" style="padding:0;">
            <img src="cid:${brandNameCid}" alt="${brand}" width="200" style="display:block;border:0;width:200px;max-width:100%;height:auto;" />
          </td>
        </tr>
      </table>`
    : `<h1 style="margin:8px 0 0;font-size:22px;line-height:1.2;color:#ffffff;font-weight:700;text-align:center;">${brand}</h1>`;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="${fill}width:100%;">
      <tr>
        <td class="email-header-bg" bgcolor="${bg}" align="center" style="${fill}padding:12px 16px 14px;text-align:center;color:#ffffff;">
          <p class="email-header-label" style="margin:0;font-size:14px;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;font-weight:800;">
            <span class="email-header-label" style="color:#ffffff;-webkit-text-fill-color:#ffffff;">${escapeHtml(eyebrow)}</span>
          </p>
          ${title}
        </td>
      </tr>
    </table>
  `;
}

export function emailRow(label: string, value: string, extra = "") {
  return `
    <tr>
      <td valign="top" width="38%" style="padding:12px 10px 12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#717171;">${escapeHtml(label)}</td>
      <td valign="top" width="62%" align="right" style="padding:12px 0;border-bottom:1px solid #e4e8ee;font-size:14px;color:#111111;text-align:right;word-break:break-word;${extra}">${value}</td>
    </tr>
  `;
}

export function emailContactCta(href?: string, align: "left" | "center" = "left") {
  const label = "Contact us";
  const wrap = align === "center" ? "text-align:center;" : "";
  if (!href) {
    return `<p style="margin:16px 0 0;font-size:14px;font-weight:700;color:${EMAIL_BLUE};${wrap}">${label}</p>`;
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
    <tr>
      <td align="${align}" style="${wrap}">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${align}">
          <tr>
            <td bgcolor="${EMAIL_BLUE}" align="center" style="background-color:${EMAIL_BLUE};border-radius:8px;">
              <a href="${escapeHtml(href)}" style="display:inline-block;background-color:${EMAIL_BLUE};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;line-height:1.2;padding:12px 18px;border-radius:8px;">${label}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export function emailShell(header: string, body: string, footer: string, headerBg = EMAIL_NAVY, bodyBg = "#ffffff") {
  const footerColor = bodyBg === "#ffffff" ? "#717171" : "#c5c8cc";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      :root { color-scheme: light only; }
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
      table { border-collapse: collapse !important; }
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; }
      img { max-width: 100% !important; height: auto !important; }
      .email-header-bg { background-color: ${headerBg} !important; color: #ffffff !important; }
      @media only screen and (max-width: 620px) {
        .email-card { width: 100% !important; max-width: 100% !important; }
        .email-pad { padding: 16px 12px !important; }
        .email-amount { font-size: 28px !important; line-height: 1.2 !important; }
      }
      .email-header-label, .email-header-label span { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
      @media (prefers-color-scheme: dark) {
        .email-header-bg { background-color: ${headerBg} !important; color: #ffffff !important; }
        .email-header-label, .email-header-label span { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#111111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8" style="background-color:#f4f6f8;width:100%;">
      <tr>
        <td align="center" style="padding:12px 0;">
          <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" bgcolor="${bodyBg}" style="width:100%;max-width:560px;background-color:${bodyBg};border-radius:16px;border:1px solid #d5d7db;">
            <tr>
              <td bgcolor="${headerBg}" style="background-color:${headerBg};padding:0;">${header}</td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="${bodyBg}" style="background-color:${bodyBg};padding:20px 16px;">${body}</td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="${bodyBg}" style="background-color:${bodyBg};padding:0 16px 20px;font-size:12px;line-height:1.6;color:${footerColor};word-break:break-word;">${footer}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
