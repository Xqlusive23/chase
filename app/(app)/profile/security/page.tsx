"use client";

import { FormEvent, useState } from "react";
import { BackLink } from "../../../components/BackLink";
import { Toggle } from "../../../components/Toggle";
import { defaultPreferences } from "../../../lib/activity";
import { useBank } from "../../../lib/bank-context";
import { getUser, updateUser } from "../../../lib/users";

export default function SecurityPage() {
  const { username, state, update } = useBank();
  const prefs = { ...defaultPreferences(), ...state.preferences };
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  function savePassword(event: FormEvent) {
    event.preventDefault();
    const user = getUser(username);
    if (!user || user.password !== currentPassword) {
      setError("Current password is not correct.");
      return;
    }
    if (nextPassword.trim().length < 4 || nextPassword !== confirmPassword) {
      setError("Enter a matching new password with at least 4 characters.");
      return;
    }
    updateUser(username, { password: nextPassword.trim() });
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setError("");
    setSaved("Password updated.");
  }

  function savePin(event: FormEvent) {
    event.preventDefault();
    if (pin && (pin.length < 4 || pin.length > 6)) {
      setError("PIN should be 4 to 6 digits.");
      return;
    }
    update((current) => ({ ...current, transferPin: pin }));
    updateUser(username, { transferPin: pin });
    setError("");
    setSaved("Transfer PIN updated.");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink href="/profile" label="Settings" />
      <h1 className="page-title">Security</h1>
      <div className="soft-card p-5">
        <Toggle
          label="Two-step sign-in"
          checked={prefs.twoStep}
          onChange={(value) =>
            update((current) => ({
              ...current,
              preferences: { ...defaultPreferences(), ...current.preferences, twoStep: value },
            }))
          }
        />
      </div>
      <form onSubmit={savePassword} className="soft-card space-y-3 p-5">
        <h2 className="font-semibold">Change password</h2>
        <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="field" placeholder="Current password" />
        <input type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} className="field" placeholder="New password" />
        <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="field" placeholder="Confirm new password" />
        <button className="btn-primary w-full">Update password</button>
      </form>
      <form onSubmit={savePin} className="soft-card space-y-3 p-5">
        <h2 className="font-semibold">Transfer PIN</h2>
        <p className="text-sm text-[var(--muted)]">{state.transferPin ? "A PIN is already set. Enter a new one to replace it." : "Set a PIN to confirm payments."}</p>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className="field"
          placeholder="4–6 digits"
        />
        <button className="btn-primary w-full">Save PIN</button>
      </form>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-[var(--blue)]">{saved}</p>}
    </div>
  );
}
