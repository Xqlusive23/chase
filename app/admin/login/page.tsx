"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "../../components/Logo";
import { signIn } from "../../lib/session";
import { ensureDefaultAdmin, verifyUser } from "../../lib/users";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ensureDefaultAdmin();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    ensureDefaultAdmin();
    const user = verifyUser(username, password);
    if (!user || user.role !== "admin") {
      setError("Use the admin username and password.");
      return;
    }

    setIsLoading(true);
    signIn(user.username, "admin");
    window.location.assign("/admin");
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(11, 31, 58, 0.35) 0%, rgba(11, 31, 58, 0.5) 100%), url('/assets/login-bg.jpg')",
      }}
    >
      <div className="page-enter mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12">
        <Logo href="/" light size="lg" />
        <div className="mt-8 w-full rounded-lg bg-white p-7 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--blue)]">Admin</p>
          <h1 className="mt-1 text-xl font-semibold text-[var(--navy)]">Sign in to manage activity</h1>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="field"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                autoComplete="current-password"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={isLoading} className="btn-primary w-full">
              {isLoading ? "Opening admin…" : "Open admin"}
            </button>
          </form>
          <p className="mt-4 text-sm text-[var(--blue)]">
            <Link href="/login" className="underline">
              Member sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
