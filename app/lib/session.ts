import type { Session, UserRole } from "./types";
import { getUser } from "./users";

const SESSION_KEY = "northline_session";

function resolveRole(username: string, role?: UserRole): UserRole {
  const stored = typeof window === "undefined" ? undefined : getUser(username);
  if (stored?.role === "admin") return "admin";
  if (stored?.role === "member") return "member";
  if (username.toLowerCase() === "admin") return "admin";
  return role ?? "member";
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.username) return null;
    return {
      ...parsed,
      role: resolveRole(parsed.username, parsed.role),
    };
  } catch {
    return null;
  }
}

export function signIn(username: string, role: UserRole = "member") {
  const session: Session = {
    username,
    role: resolveRole(username, role),
    signedInAt: new Date().toISOString(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function createDemoCredentials() {
  const adjectives = ["cedar", "harbor", "willow", "ember", "quartz", "maple"];
  const nouns = ["otter", "finch", "grove", "ridge", "brook", "wren"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = Math.floor(10 + Math.random() * 89);
  return {
    username: `${adjective}${noun}${suffix}`,
    password: `Acct-${Math.random().toString(36).slice(2, 8)}!`,
  };
}
