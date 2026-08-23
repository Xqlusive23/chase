import { Resend } from "resend";
import { bankDisplayName } from "./brand";

type SendInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromName?: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentId?: string;
  }[];
};

export function brandedFromAddress(brandName?: string) {
  const configured = process.env.RESEND_FROM_EMAIL || "Notifications <onboarding@resend.dev>";
  const email = configured.match(/<([^>]+)>/)?.[1]?.trim() || configured.trim();
  const name = bankDisplayName(brandName).replace(/[<>\r\n"]/g, "").trim() || "Notifications";
  return `"${name}" <${email}>`;
}

export async function sendResendEmail(input: SendInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { ok: false as const, error: "Missing RESEND_API_KEY", status: 501 };
  }

  const from = brandedFromAddress(input.fromName);
  const testInbox = process.env.RESEND_TEST_INBOX?.trim();
  const intended = input.to.trim().toLowerCase();
  const usingTestSender = from.toLowerCase().includes("onboarding@resend.dev");
  const deliverTo =
    usingTestSender && testInbox && intended !== testInbox.toLowerCase() ? testInbox : input.to.trim();

  const resend = new Resend(key);
  const payload = {
    from,
    to: deliverTo,
    subject: input.subject,
    html: input.html,
    text: input.text,
    attachments: input.attachments,
  };
  let result = await resend.emails.send(payload);

  if (result.error && testInbox && !usingTestSender) {
    result = await resend.emails.send({
      ...payload,
      from: "Notifications <onboarding@resend.dev>",
      to: testInbox,
    });
    if (!result.error) {
      return {
        ok: true as const,
        deliveredTo: testInbox,
        intendedRecipient: input.to.trim(),
      };
    }
  }

  if (result.error) {
    return { ok: false as const, error: result.error.message, status: 502 };
  }

  return {
    ok: true as const,
    deliveredTo: deliverTo,
    intendedRecipient: deliverTo.toLowerCase() === intended ? undefined : input.to.trim(),
  };
}
