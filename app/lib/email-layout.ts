function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailHeader(eyebrow: string, brandName: string, brandNameCid?: string, brandMarkCid?: string) {
  const brand = escapeHtml(brandName);
  const icon = brandMarkCid
    ? `<img src="cid:${brandMarkCid}" alt="" width="40" height="40" style="display:block;border:0;width:40px;height:40px;border-radius:8px;background-color:#001f4d;" />`
    : "";
  const title = brandNameCid
    ? `<img src="cid:${brandNameCid}" alt="${brand}" width="200" style="display:block;border:0;max-width:80%;width:200px;height:auto;margin:10px 0 0;" />`
    : `<h1 style="margin:10px 0 0;font-size:24px;line-height:1.2;color:#ffffff;font-weight:700;">${brand}</h1>`;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#002e6d">
      <tr>
        <td bgcolor="#002e6d" style="background-color:#002e6d;padding:22px 20px;text-align:left;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              ${icon ? `<td valign="middle" style="padding-right:12px;">${icon}</td>` : ""}
              <td valign="middle">
                <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;opacity:0.75;">${escapeHtml(eyebrow)}</p>
              </td>
            </tr>
          </table>
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

export function emailShell(header: string, body: string, footer: string) {
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
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#111111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8" style="background-color:#f4f6f8;width:100%;">
      <tr>
        <td align="center" style="padding:16px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e8ee;">
            <tr>
              <td>${header}</td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px;">${body}</td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="background-color:#ffffff;padding:0 20px 20px;font-size:12px;line-height:1.6;color:#717171;">${footer}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
