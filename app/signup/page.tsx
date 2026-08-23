"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import { createDemoCredentials } from "../lib/session";
import { notifyAccountEmail } from "../lib/notify-account";
import { createUser, ensureDefaultAdmin } from "../lib/users";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [transferPin, setTransferPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [demo, setDemo] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    ensureDefaultAdmin();
    setDemo(createDemoCredentials());
  }, []);

  function useGenerated() {
    setUsername(demo.username);
    setPassword(demo.password);
    setConfirm(demo.password);
    if (!displayName) setDisplayName(demo.username);
    setError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Choose a username and password.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required so you can recover your password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (transferPin && (transferPin.length < 4 || transferPin.length > 6)) {
      setError("Transfer PIN should be 4 to 6 digits.");
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
        approved: false,
      });
      await notifyAccountEmail({
        to: user.email || email.trim(),
        displayName: user.displayName,
        kind: "pending",
      });
      setSubmitted(true);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Could not create the account.");
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
            {submitted ? (
              <>
                <h1 className="text-xl font-semibold text-[var(--navy)]">Application received</h1>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Your account is pending approval. We sent a confirmation to your email. You can sign in after an administrator approves the application.
                </p>
                <p className="mt-5 text-sm text-[var(--blue)]">
                  <Link href="/login" className="font-semibold underline">Back to sign in</Link>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-[var(--navy)]">Create an account</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">Applications are reviewed before you can sign in.</p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Full name</span>
                    <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="field" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Username</span>
                    <input value={username} onChange={(event) => setUsername(event.target.value)} className="field" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Email</span>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Address</span>
                    <input value={address} onChange={(event) => setAddress(event.target.value)} className="field" placeholder="Used as your billing address" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Transfer PIN</span>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={transferPin}
                      onChange={(event) => setTransferPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="field"
                      placeholder="4–6 digits for payments"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Password</span>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[var(--muted)]">Confirm password</span>
                    <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="field" />
                  </label>
                  {error && <p className="text-sm text-red-700">{error}</p>}
                  <button disabled={isLoading} className="btn-primary w-full">
                    {isLoading ? "Submitting application…" : "Submit application"}
                  </button>
                </form>
                <div className="mt-5 rounded border border-dashed border-[var(--line)] bg-[var(--sky)] p-3 text-xs text-[var(--navy)]">
                  <p className="font-semibold">Need a suggested username?</p>
                  <p className="mt-1">
                    {demo.username || "…"} / {demo.password || "…"}
                  </p>
                  <button type="button" onClick={useGenerated} className="mt-1 font-medium underline">
                    Fill these in
                  </button>
                </div>
                <p className="mt-5 text-sm text-[var(--blue)]">
                  Already enrolled? <Link href="/login" className="font-semibold underline">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
