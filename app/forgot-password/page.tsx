"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Logo } from "../components/Logo";
import { findUserByEmail, resetPasswordByEmail } from "../lib/users";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [found, setFound] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  function lookup(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved("");
    const user = findUserByEmail(email);
    if (!user || user.role === "admin") {
      setFound("");
      setError("No member account uses that email.");
      return;
    }
    setFound(user.username);
  }

  function reset(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      resetPasswordByEmail(email, password);
      setSaved("Password updated. You can sign in with the new password.");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the password.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--page)]">
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11, 31, 58, 0.35) 0%, rgba(11, 31, 58, 0.45) 100%), url('/assets/login-bg.jpg')",
        }}
      >
        <div className="page-enter mx-auto flex max-w-md flex-col items-center px-4 pb-16 pt-10">
          <Logo href="/" light size="lg" />
          <div className="mt-8 w-full rounded-lg bg-white p-7 shadow-xl">
            <h1 className="text-xl font-semibold text-[var(--navy)]">Forgot password</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Use the email from registration to reset your password.</p>
            <form onSubmit={lookup} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm text-[var(--muted)]">Email</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
              </label>
              <button className="btn-secondary w-full">Find account</button>
            </form>
            {found && (
              <form onSubmit={reset} className="mt-5 space-y-4 border-t border-[var(--line)] pt-5">
                <p className="text-sm text-[var(--navy)]">Account found for @{found}. Set a new password.</p>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" placeholder="New password" />
                <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="field" placeholder="Confirm password" />
                <button className="btn-primary w-full">Reset password</button>
              </form>
            )}
            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
            {saved && <p className="mt-4 text-sm text-[var(--blue)]">{saved}</p>}
            <p className="mt-5 text-sm text-[var(--blue)]">
              <Link href="/login" className="font-semibold underline">Back to sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
