"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { fromDateTimeLocal, toDateTimeLocal } from "../../lib/format";
import { createUser } from "../../lib/users";

export default function AdminNewMemberPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [transferPin, setTransferPin] = useState("");
  const [password, setPassword] = useState("");
  const [createdAt, setCreatedAt] = useState(toDateTimeLocal(new Date().toISOString()));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required for password recovery.");
      return;
    }

    try {
      setIsLoading(true);
      const user = createUser({
        username: username.trim(),
        displayName: displayName.trim() || username.trim(),
        password,
        email: email.trim(),
        address: address.trim(),
        transferPin: transferPin.trim(),
        createdAt: fromDateTimeLocal(createdAt),
        approved: true,
      });
      router.push(`/admin/users/${encodeURIComponent(user.username)}`);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Could not create the member.");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <Link href="/admin/members" className="text-sm font-semibold text-[var(--blue)]">
          ← Members
        </Link>
        <h1 className="page-title mt-2">Create a member</h1>
        <p className="page-sub">
          Use this exact username and password on the main sign-in page. The full name alone will also work if it is unique.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Full name</span>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Username</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Address</span>
          <input value={address} onChange={(event) => setAddress(event.target.value)} className="field" placeholder="Saved as billing address" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Transfer PIN</span>
          <input
            type="password"
            inputMode="numeric"
            value={transferPin}
            onChange={(event) => setTransferPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="field"
            placeholder="4–6 digits"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Account created</span>
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(event) => setCreatedAt(event.target.value)}
            className="field"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={isLoading} className="btn-primary w-full">
          {isLoading ? "Creating…" : "Create profile"}
        </button>
      </form>
    </div>
  );
}
