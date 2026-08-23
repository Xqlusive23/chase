"use client";

import { US_BANKS } from "../lib/us-banks";

export function BankSelect({
  bankName,
  routingNumber,
  onChange,
}: {
  bankName: string;
  routingNumber: string;
  onChange: (next: { bankName: string; routingNumber: string }) => void;
}) {
  const selected = US_BANKS.find((bank) => bank.name === bankName);
  const banks = US_BANKS.filter((bank) => bank.kind === "bank");
  const prepaid = US_BANKS.filter((bank) => bank.kind === "prepaid");

  return (
    <div className="grid gap-3 md:grid-cols-2 md:col-span-2">
      <label className="block">
        <span className="mb-1 block text-sm text-[var(--muted)]">Recipient bank</span>
        <select
          value={selected?.id ?? ""}
          onChange={(event) => {
            const bank = US_BANKS.find((item) => item.id === event.target.value);
            onChange({
              bankName: bank?.name ?? "",
              routingNumber: bank?.routingNumber ?? "",
            });
          }}
          className="field"
          required
        >
          <option value="">Choose a U.S. bank</option>
          <optgroup label="Banks and credit unions">
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Prepaid and digital banks">
            {prepaid.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-[var(--muted)]">Routing number</span>
        <input className="field" value={routingNumber} readOnly />
      </label>
    </div>
  );
}
