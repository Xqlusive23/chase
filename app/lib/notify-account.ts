import { readBrand } from "./brand";
import { prepareBrandHeaderImage } from "./email-images";
import { isValidEmail } from "./notify-transfer";
import type { AccountNotice } from "./account-email";

export async function notifyAccountEmail(input: Omit<AccountNotice, "brandName" | "brandNameImage"> & { brandName?: string }) {
  const to = input.to.trim();
  if (!to || !isValidEmail(to)) return;
  try {
    const brand = readBrand();
    const brandNameImage = await prepareBrandHeaderImage(brand.nameImage);
    await fetch("/api/notify-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        to,
        brandName: input.brandName || brand.name,
        brandNameImage,
      }),
    });
  } catch {
    /* missing key or network should not block signup */
  }
}
