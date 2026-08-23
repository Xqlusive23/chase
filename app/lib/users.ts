import type { StoredUser, UserRole } from "./types";
import { findBankUsername, listBankUsernames, loadBank, saveBank } from "./bank-store";
import { DEFAULT_BRAND } from "./brand";

const USERS_KEY = "northline_users";

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "northline";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function listUsers() {
  ensureDefaultAdmin();
  return readUsers();
}

export function syncOrphanedMembers() {
  if (typeof window === "undefined") return;
  const users = readUsers();
  let changed = false;
  for (const name of listBankUsernames()) {
    if (getAdminAccount()?.username.toLowerCase() === name.toLowerCase()) continue;
    if (users.some((user) => user.username.toLowerCase() === name.toLowerCase())) continue;
    const bank = loadBank(name);
    users.push({
      username: name,
      displayName: bank.displayName || name,
      password: "",
      role: "member",
      approved: true,
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }
  if (changed) writeUsers(users);
}

export function listMembers() {
  ensureDefaultAdmin();
  syncOrphanedMembers();
  return readUsers().filter((user) => user.role === "member");
}

export function getUser(username: string) {
  return findAccount(username);
}

export function findAccount(identifier: string) {
  const needle = identifier.trim().toLowerCase();
  if (!needle) return undefined;
  return readUsers().find(
    (user) =>
      user.username.toLowerCase() === needle ||
      user.displayName.trim().toLowerCase() === needle ||
      (user.email ?? "").trim().toLowerCase() === needle
  );
}

export function findUserByEmail(email: string) {
  const needle = email.trim().toLowerCase();
  if (!needle) return undefined;
  return readUsers().find((user) => (user.email ?? "").trim().toLowerCase() === needle);
}

export function getAdminAccount() {
  return readUsers().find((user) => user.role === "admin");
}

export function isMemberApproved(user: StoredUser) {
  return user.role === "admin" || user.approved !== false;
}

export function ensureDefaultAdmin() {
  const users = readUsers();
  if (users.some((user) => user.role === "admin")) return;
  users.unshift({
    username: ADMIN_USERNAME,
    displayName: `${DEFAULT_BRAND.name} Admin`,
    password: ADMIN_PASSWORD,
    role: "admin",
    approved: true,
    createdAt: new Date().toISOString(),
  });
  writeUsers(users);
}

export function createUser(input: {
  username: string;
  displayName: string;
  password: string;
  email?: string;
  address?: string;
  transferPin?: string;
  role?: UserRole;
  approved?: boolean;
  createdAt?: string;
}) {
  const username = input.username.trim();
  if (!username) throw new Error("Username is required.");
  const admin = getAdminAccount();
  if (admin && username.toLowerCase() === admin.username.toLowerCase()) {
    throw new Error("That username is reserved.");
  }
  if (getUser(username)) {
    throw new Error("That username is already taken.");
  }
  const email = input.email?.trim() ?? "";
  if (email && findUserByEmail(email)) {
    throw new Error("That email is already in use.");
  }

  const user: StoredUser = {
    username,
    displayName: input.displayName.trim() || username,
    password: input.password.trim(),
    email,
    address: input.address?.trim() ?? "",
    transferPin: input.transferPin?.trim() ?? "",
    role: input.role ?? "member",
    approved: input.role === "admin" ? true : input.approved ?? true,
    createdAt: input.createdAt || new Date().toISOString(),
  };

  writeUsers([...readUsers(), user]);
  const saved = findAccount(user.username);
  if (!saved || saved.password !== user.password) {
    throw new Error("The account could not be saved. Try creating it again.");
  }

  if (user.role === "member") {
    const bank = loadBank(user.username);
    saveBank(user.username, {
      ...bank,
      displayName: user.displayName,
      email: user.email ?? "",
      address: user.address ?? "",
      billingAddress: user.address ?? "",
      transferPin: user.transferPin ?? "",
      cards: bank.cards.map((card) => ({ ...card, holder: user.displayName })),
    });
  }
  return saved;
}

export function recoverMember(identifier: string, password: string) {
  const bankName = findBankUsername(identifier);
  if (!bankName || bankName.toLowerCase() === (getAdminAccount()?.username ?? ADMIN_USERNAME).toLowerCase()) return null;

  const existing = findAccount(bankName);
  if (existing) {
    return existing.password === password.trim() ? existing : null;
  }

  const bank = loadBank(bankName);
  const user: StoredUser = {
    username: bankName,
    displayName: bank.displayName || bankName,
    password: password.trim(),
    role: "member",
    approved: true,
    createdAt: new Date().toISOString(),
  };
  writeUsers([...readUsers(), user]);
  return findAccount(bankName) ?? user;
}

export function verifyUser(username: string, password: string) {
  ensureDefaultAdmin();
  syncOrphanedMembers();
  const user = findAccount(username);
  if (user) {
    if (!user.password) {
      const repaired = { ...user, password: password.trim() };
      writeUsers(readUsers().map((entry) => (entry.username === user.username ? repaired : entry)));
      return repaired;
    }
    if (user.password !== password.trim()) return null;
    return user;
  }
  return recoverMember(username, password);
}

export function updateAdminAccount(patch: { username?: string; password?: string; email?: string; displayName?: string }) {
  ensureDefaultAdmin();
  const users = readUsers();
  const current = users.find((user) => user.role === "admin");
  if (!current) throw new Error("Admin account not found.");
  const username = patch.username?.trim() || current.username;
  if (
    username.toLowerCase() !== current.username.toLowerCase() &&
    users.some((user) => user.username.toLowerCase() === username.toLowerCase())
  ) {
    throw new Error("That username is already taken.");
  }
  const next: StoredUser = {
    ...current,
    username,
    displayName: patch.displayName?.trim() || current.displayName,
    password: patch.password?.trim() || current.password,
    email: patch.email?.trim() ?? current.email,
  };
  writeUsers(users.map((user) => (user.username === current.username ? next : user)));
  return next;
}

export function setMemberApproval(username: string, approved: boolean) {
  const users = readUsers();
  const current = users.find((user) => user.username === username && user.role === "member");
  if (!current) throw new Error("Member not found.");
  const next = { ...current, approved };
  writeUsers(users.map((user) => (user.username === username ? next : user)));
  return next;
}

export function updateUserName(username: string, displayName: string) {
  updateUser(username, { displayName });
}

export function resetPasswordByEmail(email: string, nextPassword: string) {
  const user = findUserByEmail(email);
  if (!user || user.role === "admin") throw new Error("No member account uses that email.");
  if (nextPassword.trim().length < 4) throw new Error("Use a password with at least 4 characters.");
  return updateUser(user.username, { password: nextPassword.trim() });
}

export function updateUser(
  username: string,
  patch: Partial<Pick<StoredUser, "displayName" | "password" | "createdAt" | "email" | "address" | "transferPin">>
) {
  const users = readUsers();
  const current = users.find((user) => user.username === username);
  if (!current) throw new Error("User not found.");
  if (current.role === "admin") throw new Error("The admin account cannot be edited here.");

  const next: StoredUser = {
    ...current,
    ...patch,
    displayName: patch.displayName?.trim() || current.displayName,
    password: patch.password?.trim() || current.password,
    createdAt: patch.createdAt || current.createdAt,
  };

  writeUsers(users.map((user) => (user.username === username ? next : user)));

  if (patch.displayName || patch.email !== undefined || patch.address !== undefined || patch.transferPin !== undefined) {
    const bank = loadBank(username);
    saveBank(username, {
      ...bank,
      displayName: next.displayName,
      email: next.email ?? bank.email,
      address: next.address ?? bank.address,
      billingAddress: next.address ?? bank.billingAddress ?? next.address,
      transferPin: next.transferPin ?? bank.transferPin,
      cards: patch.displayName ? bank.cards.map((card) => ({ ...card, holder: next.displayName })) : bank.cards,
    });
  }

  return next;
}

export function deleteUser(username: string) {
  const user = getUser(username);
  if (!user || user.role === "admin") {
    throw new Error("That member cannot be removed.");
  }
  writeUsers(readUsers().filter((entry) => entry.username !== username));
  localStorage.removeItem(`northline_bank_${username}`);
}
