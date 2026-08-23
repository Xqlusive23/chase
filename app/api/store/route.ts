import { NextResponse } from "next/server";
import type { AppStore } from "../../lib/app-store";
import { isStoreConfigured, readServerStore, writeServerStore } from "../../lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = await readServerStore();
    return NextResponse.json({ ok: true, configured: isStoreConfigured(), store });
  } catch (error) {
    return NextResponse.json(
      { ok: false, configured: isStoreConfigured(), error: error instanceof Error ? error.message : "Could not read store" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  let store: AppStore;
  try {
    store = (await request.json()) as AppStore;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!store?.brand || !Array.isArray(store.users) || !store.banks || typeof store.banks !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid store" }, { status: 400 });
  }

  try {
    const next = { ...store, updatedAt: Date.now() };
    await writeServerStore(next);
    return NextResponse.json({ ok: true, configured: true, store: next });
  } catch (error) {
    return NextResponse.json(
      { ok: false, configured: isStoreConfigured(), error: error instanceof Error ? error.message : "Could not save store" },
      { status: 503 }
    );
  }
}
