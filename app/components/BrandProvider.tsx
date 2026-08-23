"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { applyAppIcons } from "../lib/app-icon";
import { DEFAULT_BRAND, applyBrandName, readBrand, writeBrand, type BrandSettings } from "../lib/brand";

type BrandContextValue = {
  brand: BrandSettings;
  setBrand: (brand: BrandSettings) => void;
};

const BrandContext = createContext<BrandContextValue>({
  brand: DEFAULT_BRAND,
  setBrand: () => undefined,
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrandState] = useState<BrandSettings>(DEFAULT_BRAND);

  useEffect(() => {
    function sync() {
      setBrandState(readBrand());
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("chise-brand", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("chise-brand", sync);
    };
  }, []);

  useEffect(() => {
    document.title = `${brand.name} — Online banking`;
    void applyAppIcons(brand);
  }, [brand]);

  function setBrand(next: BrandSettings) {
    writeBrand(next);
    setBrandState(next);
  }

  return <BrandContext.Provider value={{ brand, setBrand }}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}

export function useBrandLabel() {
  const { brand } = useBrand();
  return (text: string) => applyBrandName(text, brand.name);
}
