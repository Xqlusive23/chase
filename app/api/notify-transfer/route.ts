import { NextResponse } from "next/server";
import { inlineFromDataUrl, publicBankLogoUrl } from "../../lib/email-images";
import { isValidEmail, transferEmailCopy, type TransferNotice } from "../../lib/notify-transfer";
import { sendResendEmail } from "../../lib/send-resend";
import { transferEmailHtml } from "../../lib/transfer-email";

export async function POST(request: Request) {
  let body: TransferNotice;
  try {
    body = (await request.json()) as TransferNotice;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(body.to) || !body.brandName || !body.transactionId) {
    return NextResponse.json({ ok: false, error: "Invalid transfer notice" }, { status: 400 });
  }

  const brandNameCid = "brand-name";
  const brandImage = inlineFromDataUrl(body.brandNameImage, brandNameCid, "brand-name.png");
  const bankLogo = body.bankLogo || publicBankLogoUrl(body.bankName);
  const notice = {
    ...body,
    brandNameCid: brandImage ? brandNameCid : undefined,
    bankLogo,
  };
  const copy = transferEmailCopy(notice);
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const supportUrl = notice.supportHref || `${origin}/support`;
  const result = await sendResendEmail({
    to: body.to,
    fromName: body.brandName,
    subject: copy.subject,
    html: transferEmailHtml({ ...notice, intendedRecipient: undefined }, supportUrl),
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

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  const mailed = { ...notice, intendedRecipient: result.intendedRecipient };
  return NextResponse.json({
    ok: true,
    deliveredTo: result.deliveredTo,
    intendedRecipient: result.intendedRecipient,
    subject: transferEmailCopy(mailed).subject,
  });
}
