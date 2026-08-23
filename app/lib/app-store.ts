import type { BankState, StoredUser } from "./types";
import type { BrandSettings } from "./brand";

export type AppStore = {
  updatedAt: number;
  brand: BrandSettings;
  users: StoredUser[];
  banks: Record<string, BankState>;
};
