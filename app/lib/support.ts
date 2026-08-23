import type { MemberSupport, SupportChannel } from "./types";

export const SUPPORT_CHANNELS: { id: SupportChannel; label: string }[] = [
  { id: "phone", label: "Mobile number" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Gmail / email" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "telegram", label: "Telegram" },
  { id: "other", label: "Other" },
];

export function supportPlaceholder(channel?: SupportChannel) {
  if (channel === "phone") return "Mobile number";
  if (channel === "whatsapp") return "WhatsApp number";
  if (channel === "email") return "Email address";
  if (channel === "instagram" || channel === "facebook" || channel === "telegram") return "@handle or profile link";
  return "Number, email, or handle";
}

export function supportHref(support?: MemberSupport) {
  if (!support?.value) return "";
  const value = support.value.trim();
  if (support.channel === "phone") {
    const tel = value.replace(/[^\d+]/g, "");
    return tel ? `tel:${tel}` : "";
  }
  if (support.channel === "whatsapp") {
    return `https://wa.me/${value.replace(/\D/g, "")}`;
  }
  if (support.channel === "email") return `mailto:${value}`;
  if (support.channel === "instagram") {
    return value.startsWith("http") ? value : `https://instagram.com/${value.replace(/^@/, "")}`;
  }
  if (support.channel === "facebook") {
    return value.startsWith("http") ? value : `https://facebook.com/${value.replace(/^@/, "")}`;
  }
  if (support.channel === "telegram") {
    return value.startsWith("http") ? value : `https://t.me/${value.replace(/^@/, "")}`;
  }
  return value.startsWith("http") ? value : `mailto:${value}`;
}

export function supportLabel(support?: MemberSupport) {
  const channel = SUPPORT_CHANNELS.find((item) => item.id === support?.channel)?.label ?? "Support";
  return support?.value ? `${channel}: ${support.value}` : channel;
}
