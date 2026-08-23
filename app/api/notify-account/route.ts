import { NextResponse } from "next/server";
import { accountEmailCopy, accountEmailHtml, type AccountNotice } from "../../lib/account-email";
import { inlineFromDataUrl } from "../../lib/email-images";
import { isValidEmail } from "../../lib/notify-transfer";
import { sendResendEmail } from "../../lib/send-resend";

export async function POST(request: Request) {
  let body: AccountNotice;
  try {
    body = (await request.json()) as AccountNotice;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(body.to) || !body.brandName || (body.kind !== "pending" && body.kind !== "approved")) {
    return NextResponse.json({ ok: false, error: "Invalid account notice" }, { status: 400 });
  }

  const brandNameCid = "brand-name";
  const brandMarkCid = "brand-mark";
  const brandImage = inlineFromDataUrl(body.brandNameImage, brandNameCid, "brand-name.png");
  const brandMark = inlineFromDataUrl(body.brandLogo, brandMarkCid, "logo.png");
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const notice: AccountNotice = {
    ...body,
    brandNameCid: brandImage ? brandNameCid : undefined,
    brandMarkCid: brandMark ? brandMarkCid : undefined,
    loginHref: body.loginHref || `${origin}/login`,
  };
  const copy = accountEmailCopy(notice);
  const result = await sendResendEmail({
    to: body.to,
    fromName: body.brandName,
    subject: copy.subject,
    html: accountEmailHtml(notice),
    text: copy.text,
    attachments: (() => {
      const files = [brandMark, brandImage].filter((item): item is NonNullable<typeof brandImage> => Boolean(item));
      return files.length
        ? files.map((item) => ({
            filename: item.filename,
            content: Buffer.from(item.content, "base64"),
            contentId: item.contentId,
          }))
        : undefined;
    })(),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    deliveredTo: result.deliveredTo,
    intendedRecipient: result.intendedRecipient,
  });
}
