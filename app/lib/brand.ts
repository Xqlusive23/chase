export type BrandSettings = {
  name: string;
  logo: string;
  nameImage: string;
  nameImageScale: number;
};

export const BRAND_KEY = "chise_brand";

export const DEFAULT_BRAND: BrandSettings = {
  name: "Chise Bank",
  logo: "",
  nameImage: "",
  nameImageScale: 56,
};

export function readBrand(): BrandSettings {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  const raw = localStorage.getItem(BRAND_KEY);
  if (!raw) return DEFAULT_BRAND;
  try {
    const parsed = JSON.parse(raw) as BrandSettings;
    return {
      name: parsed.name?.trim() || DEFAULT_BRAND.name,
      logo: parsed.logo || "",
      nameImage: parsed.nameImage || "",
      nameImageScale: Number(parsed.nameImageScale) || DEFAULT_BRAND.nameImageScale,
    };
  } catch {
    return DEFAULT_BRAND;
  }
}

export function applyBrandName(text: string, name: string, previousName = DEFAULT_BRAND.name) {
  if (!text) return text;
  const replacements = [...new Set([previousName, DEFAULT_BRAND.name, "Chise Bank", "Chise"])]
    .filter((from) => from && from !== name)
    .sort((a, b) => b.length - a.length);
  return replacements.reduce((next, from) => next.split(from).join(name), text);
}

export function writeBrand(brand: BrandSettings) {
  const previous = readBrand();
  localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
  rebrandStoredContent(previous.name, brand.name);
  window.dispatchEvent(new Event("chise-brand"));
}

export function rebrandStoredContent(previousName: string, nextName: string) {
  if (typeof window === "undefined" || !nextName || previousName === nextName) return;
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith("northline_bank_")) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const state = JSON.parse(raw) as {
        accounts?: { name: string }[];
        cards?: { name: string }[];
      };
      if (state.accounts) {
        state.accounts = state.accounts.map((account) => ({
          ...account,
          name: applyBrandName(account.name, nextName, previousName),
        }));
      }
      if (state.cards) {
        state.cards = state.cards.map((card) => ({
          ...card,
          name: applyBrandName(card.name, nextName, previousName),
        }));
      }
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* keep the original value if a profile cannot be rewritten */
    }
  }
}

export function brandMark(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0] ?? "C"}${parts[1][0] ?? ""}`.toUpperCase();
  return (name.trim()[0] ?? "C").toUpperCase();
}
