import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inlineFromDataUrl, publicBankLogoUrl } from "../../lib/email-images";
import { isValidEmail, transferEmailCopy, type TransferNotice } from "../../lib/notify-transfer";
import { transferEmailHtml } from "../../lib/transfer-email";

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 501 });
  }

  let body: TransferNotice;
  try {
    body = (await request.json()) as TransferNotice;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(body.to) || !body.brandName || !body.transactionId) {
    return NextResponse.json({ ok: false, error: "Invalid transfer notice" }, { status: 400 });
  }

  const from = process.env.RESEND_FROM_EMAIL || "Notifications <onboarding@resend.dev>";
  const testInbox = process.env.RESEND_TEST_INBOX?.trim();
  const intended = body.to.trim().toLowerCase();
  const usingTestSender = from.toLowerCase().includes("onboarding@resend.dev");
  const deliverTo =
    usingTestSender && testInbox && intended !== testInbox.toLowerCase() ? testInbox : body.to.trim();

  const brandNameCid = "brand-name";
  const brandImage = inlineFromDataUrl(body.brandNameImage, brandNameCid, "brand-name.png");
  const bankLogo = body.bankLogo || publicBankLogoUrl(body.bankName);

  const notice = {
    ...body,
    intendedRecipient: deliverTo.toLowerCase() === intended ? undefined : body.to.trim(),
    brandNameCid: brandImage ? brandNameCid : undefined,
    bankLogo,
  };
  const copy = transferEmailCopy(notice);
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const supportUrl = notice.supportHref || `${origin}/support`;
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: deliverTo,
    subject: copy.subject,
    html: transferEmailHtml(notice, supportUrl),
    text: copy.text,
    attachments: brandImage
      ? [
          {
            filename: brandImage.filename,
            content: Buffer.from(brandImage.content, "base64"),
            contentId: brandImage.contentId,
          },
        ]
      : undefined,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, deliveredTo: deliverTo });
}
