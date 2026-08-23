import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { bankDisplayName, brandMark } from "../../lib/brand";
import { dataUrlToBytes } from "../../lib/email-images";
import { readServerStore } from "../../lib/server-store";

export const dynamic = "force-dynamic";

function letterIcon(name: string) {
  const mark = brandMark(bankDisplayName(name));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#002e6d"/>
  <text x="96" y="122" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="700" fill="#ffffff">${mark}</text>
</svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=86400",
    },
  });
}

export async function GET() {
  const store = await readServerStore().catch(() => null);
  const parsed = dataUrlToBytes(store?.brand.logo);

  if (parsed) {
    return new NextResponse(parsed.content, {
      headers: {
        "Content-Type": parsed.contentType || "image/png",
        "Cache-Control": "public, max-age=120, stale-while-revalidate=86400",
      },
    });
  }

  if (store?.brand.name) return letterIcon(store.brand.name);

  try {
    const fallback = await readFile(path.join(process.cwd(), "public", "icon.svg"));
    return new NextResponse(fallback, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
