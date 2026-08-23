"use client";

import { applyBrandName } from "../lib/brand";
import { useBrand } from "./BrandProvider";

export function BrandText({
  of,
}: {
  of?: string;
}) {
  const { brand } = useBrand();
  return <>{of ? applyBrandName(of, brand.name) : brand.name}</>;
}
