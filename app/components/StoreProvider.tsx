"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { hydrateStore, isRemoteStoreReady } from "../lib/sync";

const StoreContext = createContext<{ synced: boolean | null }>({ synced: null });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [synced, setSynced] = useState<boolean | null>(null);

  useEffect(() => {
    void hydrateStore().then((value) => {
      setSynced(value);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page)] text-[var(--navy)]">
        Loading…
      </div>
    );
  }

  return <StoreContext.Provider value={{ synced: synced ?? isRemoteStoreReady() }}>{children}</StoreContext.Provider>;
}

export function useStoreSync() {
  return useContext(StoreContext);
}
