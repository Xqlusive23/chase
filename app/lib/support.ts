import type { MemberSupport, SupportChannel } from "./types";

export const SUPPORT_CHANNELS: { id: SupportChannel; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Gmail / email" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "telegram", label: "Telegram" },
  { id: "other", label: "Other" },
];

export function supportHref(support?: MemberSupport) {
  if (!support?.value) return "";
  const value = support.value.trim();
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
