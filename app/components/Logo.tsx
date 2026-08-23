"use client";

import Link from "next/link";
import { brandMark } from "../lib/brand";
import { useBrand } from "./BrandProvider";

type LogoProps = {
  href?: string;
  light?: boolean;
  size?: "sm" | "lg";
};

export function Logo({ href = "/", light = false, size = "sm" }: LogoProps) {
  const { brand } = useBrand();
  const markBox = size === "lg" ? "h-12 w-12 text-xl" : "h-8 w-8 text-sm";
  const word = size === "lg" ? "text-2xl" : "text-lg";
  const letter = brandMark(brand.name);
  const showMark = Boolean(brand.logo) || !brand.nameImage;
  const nameHeight = Math.round((brand.nameImageScale || 56) * (size === "lg" ? 1.25 : 1));

  return (
    <Link href={href} className="inline-flex items-center gap-3">
      {brand.nameImage ? (
        <img
          src={brand.nameImage}
          alt={brand.name}
          style={{ height: nameHeight, maxWidth: nameHeight * 6 }}
          className={`w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
        />
      ) : (
        <span className={`font-semibold tracking-tight ${word} ${light ? "text-white" : "text-[#0b1f3a]"}`}>
          {brand.name}
        </span>
      )}
      {showMark &&
        (brand.logo ? (
          <img src={brand.logo} alt="" className={`${size === "lg" ? "h-12" : "h-8"} w-auto max-w-[72px] object-contain`} />
        ) : (
          <span
            className={`flex items-center justify-center rounded-md font-bold ${markBox} ${
              light ? "bg-white text-[#0b1f3a]" : "bg-[#1366d6] text-white"
            }`}
          >
            {letter}
          </span>
        ))}
    </Link>
  );
}
