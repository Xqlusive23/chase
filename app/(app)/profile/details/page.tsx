"use client";

import { FormEvent, useState } from "react";
import { BackLink } from "../../../components/BackLink";
import { useBank } from "../../../lib/bank-context";
import { updateUser } from "../../../lib/users";

export default function ProfileDetailsPage() {
  const { username, state, update } = useBank();
  const [email, setEmail] = useState(state.email ?? "");
  const [phone, setPhone] = useState(state.phone ?? "");
  const [saved, setSaved] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    update((current) => ({ ...current, email: email.trim(), phone: phone.trim() }));
    updateUser(username, { email: email.trim() });
    setSaved("Saved. Your registered name can only be changed by an admin.");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink href="/profile" label="Settings" />
      <h1 className="page-title">Profile details</h1>
      <form onSubmit={handleSubmit} className="soft-card space-y-4 p-5">
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Registered name</span>
          <input value={state.displayName} disabled className="field bg-[var(--page)]" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Phone</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Billing address</span>
          <input value={state.billingAddress || state.address || ""} disabled className="field bg-[var(--page)]" />
          <p className="mt-1 text-sm text-[var(--muted)]">Taken from the address used at registration.</p>
        </label>
        {saved && <p className="text-sm text-[var(--blue)]">{saved}</p>}
        <button className="btn-primary w-full">Save</button>
      </form>
    </div>
  );
}
