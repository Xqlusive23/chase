import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { dataUrlToBytes } from "../../lib/email-images";
import { readServerStore } from "../../lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readServerStore().catch(() => null);
  const src = store?.brand.logo || store?.brand.nameImage;
  const parsed = dataUrlToBytes(src);

  if (parsed) {
    return new NextResponse(parsed.content, {
      headers: {
        "Content-Type": parsed.contentType,
        "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  }

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
