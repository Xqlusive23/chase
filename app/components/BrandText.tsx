"use client";

import { applyBrandName, bankDisplayName } from "../lib/brand";
import { useBrand } from "./BrandProvider";

export function BrandText({
  of,
}: {
  of?: string;
  light?: boolean;
}) {
  const { brand } = useBrand();
  const bankName = bankDisplayName(brand.name);
  return <>{of ? applyBrandName(of, bankName) : bankName}</>;
}
