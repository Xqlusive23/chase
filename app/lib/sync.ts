import type { AppStore } from "./app-store";

export let quietWrites = false;

let timer: number | undefined;
let configured: boolean | null = null;

export function isRemoteStoreReady() {
  return configured;
}

export function schedulePush() {
  if (quietWrites || typeof window === "undefined") return;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    void pushStore();
  }, 400);
}

async function pushStore() {
  try {
    const { collectLocalStore } = await import("./local-store");
    const store = { ...collectLocalStore(), updatedAt: Date.now() };
    localStorage.setItem("chise_store_updated_at", String(store.updatedAt));
    const response = await fetch("/api/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    });
    const payload = (await response.json().catch(() => null)) as { configured?: boolean; error?: string } | null;
    configured = Boolean(payload?.configured && response.ok);
    if (!response.ok) {
      console.error("Shared store save failed:", payload?.error || response.statusText);
    }
  } catch (error) {
    configured = false;
    console.error("Shared store save failed:", error);
  }
}

export async function hydrateStore() {
  if (typeof window === "undefined") return false;
  try {
    const response = await fetch("/api/store", { cache: "no-store" });
    const payload = (await response.json()) as { configured?: boolean; store?: AppStore | null };
    configured = Boolean(payload.configured);
    const { applyLocalStore, collectLocalStore } = await import("./local-store");
    const remote = payload.store;
    const local = collectLocalStore();
    const localCustomized = Boolean(local.brand.logo || local.brand.nameImage || local.users.length > 1 || Object.keys(local.banks).length);

    if (remote?.updatedAt && (!local.updatedAt || remote.updatedAt >= local.updatedAt || !localCustomized)) {
      quietWrites = true;
      applyLocalStore(remote);
      quietWrites = false;
    } else if (payload.configured && localCustomized) {
      await pushStore();
    }
    return configured;
  } catch {
    configured = false;
    return false;
  }
}
