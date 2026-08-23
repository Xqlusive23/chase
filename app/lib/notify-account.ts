import { bankDisplayName, readBrand } from "./brand";
import { prepareBrandHeaderImage } from "./email-images";
import { isValidEmail } from "./notify-transfer";
import type { AccountNotice } from "./account-email";

export async function notifyAccountEmail(input: Omit<AccountNotice, "brandName" | "brandNameImage"> & { brandName?: string }) {
  const to = input.to.trim();
  if (!to || !isValidEmail(to)) return;
  try {
    const brand = readBrand();
    const mark = brand.logo || brand.nameImage;
    const brandNameImage = await prepareBrandHeaderImage(brand.nameImage, 360, "white");
    const brandLogo = await prepareBrandHeaderImage(mark, 180, brand.logo ? "none" : "white");
    const response = await fetch("/api/notify-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        to,
        brandName: bankDisplayName(input.brandName || brand.name),
        brandNameImage,
        brandLogo,
      }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      console.error("Account email failed:", payload?.error || response.statusText);
    }
  } catch {
    /* missing key or network should not block signup */
  }
}
