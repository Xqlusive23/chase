"use client";

import { BackLink } from "../../../components/BackLink";
import { Toggle } from "../../../components/Toggle";
import { defaultPreferences } from "../../../lib/activity";
import { useBank } from "../../../lib/bank-context";

export default function PreferencesPage() {
  const { state, update } = useBank();
  const prefs = { ...defaultPreferences(), ...state.preferences };

  function setPref<K extends keyof typeof prefs>(key: K, value: (typeof prefs)[K]) {
    update((current) => ({
      ...current,
      preferences: { ...defaultPreferences(), ...current.preferences, [key]: value },
    }));
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink href="/profile" label="Settings" />
      <h1 className="page-title">Preferences</h1>
      <div className="soft-card space-y-4 p-5">
        <Toggle label="Hide balances" checked={prefs.hideBalances} onChange={(value) => setPref("hideBalances", value)} />
        <Toggle label="Account alerts" checked={prefs.alerts} onChange={(value) => setPref("alerts", value)} />
        <Toggle label="Paperless statements" checked={prefs.paperless} onChange={(value) => setPref("paperless", value)} />
      </div>
    </div>
  );
}
