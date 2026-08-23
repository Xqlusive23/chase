"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "../../lib/session";
import { getAdminAccount, updateAdminAccount } from "../../lib/users";

export default function AdminAccountPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const admin = getAdminAccount();
    if (!admin) return;
    setUsername(admin.username);
    setDisplayName(admin.displayName);
    setEmail(admin.email ?? "");
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const next = updateAdminAccount({
        username,
        displayName,
        email,
        ...(password.trim() ? { password: password.trim() } : {}),
      });
      signIn(next.username, "admin");
      setPassword("");
      setConfirm("");
      setMessage("Admin sign-in details saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save admin details.");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <h1 className="page-title">Admin account</h1>
        <p className="page-sub">Change the username, password, and email used on the admin sign-in page.</p>
      </div>
      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Username</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="field" autoComplete="username" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Display name</span>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">New password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" placeholder="Leave blank to keep current" autoComplete="new-password" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Confirm password</span>
          <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="field" autoComplete="new-password" />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-[var(--navy)]">{message}</p>}
        <button className="btn-primary">Save admin login</button>
      </form>
    </div>
  );
}
