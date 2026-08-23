"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BrandText } from "../components/BrandText";
import { Logo } from "../components/Logo";
import { signIn } from "../lib/session";
import { ensureDefaultAdmin, findAccount, isMemberApproved, verifyUser } from "../lib/users";

const FOOTER_LINKS = [
  { href: "/", label: "Contact us" },
  { href: "/", label: "Privacy" },
  { href: "/", label: "Security" },
  { href: "/", label: "Terms of use" },
  { href: "/", label: "About us" },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ensureDefaultAdmin();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password.");
      return;
    }

    const user = verifyUser(username, password);
    if (!user) {
      setError(findAccount(username)
        ? "That password does not match this username."
        : "No account found. Use the exact username from admin, or create the member again.");
      return;
    }
    if (user.role === "admin") {
      setError("Admin accounts sign in from the admin page.");
      return;
    }
    if (!isMemberApproved(user)) {
      setError("Your application is still pending approval. You will get an email when it is approved.");
      return;
    }

    setIsLoading(true);
    signIn(user.username, user.role);
    window.location.assign("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--page)]">
      <div
        className="min-h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11, 31, 58, 0.35) 0%, rgba(11, 31, 58, 0.45) 100%), url('/assets/login-bg.jpg')",
        }}
      >
        <div className="page-enter mx-auto flex max-w-md flex-col items-center px-4 pb-16 pt-10">
          <Logo href="/" light size="lg" />

          <div className="mt-8 w-full rounded-lg bg-white p-7 shadow-xl">
            <h1 className="text-xl font-semibold text-[var(--navy)]">Sign in</h1>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Username or full name</span>
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
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
              <p className="text-sm text-[var(--blue)]">
                <Link href="/forgot-password" className="font-semibold underline">Forgot password?</Link>
              </p>
              <p className="text-sm text-[var(--blue)]">
                Not enrolled? <Link href="/signup" className="font-semibold underline">Sign up now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-white px-4 py-10 text-xs text-[var(--navy)]">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-2 leading-8 text-[var(--blue)] underline underline-offset-2">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-[var(--navy)]">
              {item.label}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-[var(--muted)]">
          © {new Date().getFullYear()} <BrandText />. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
