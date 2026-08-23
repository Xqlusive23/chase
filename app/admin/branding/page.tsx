"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useBrand } from "../../components/BrandProvider";
import { useStoreSync } from "../../components/StoreProvider";
import { DEFAULT_BRAND, brandMark } from "../../lib/brand";
import { shrinkDataImage } from "../../lib/email-images";
import { pushStore } from "../../lib/sync";

export default function AdminBrandingPage() {
  const { brand, setBrand } = useBrand();
  const { synced } = useStoreSync();
  const logoRef = useRef<HTMLInputElement>(null);
  const nameImageRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(brand.name);
  const [logo, setLogo] = useState(brand.logo);
  const [nameImage, setNameImage] = useState(brand.nameImage);
  const [nameImageScale, setNameImageScale] = useState(brand.nameImageScale || 56);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(brand.name);
    setLogo(brand.logo);
    setNameImage(brand.nameImage);
    setNameImageScale(brand.nameImageScale || 56);
  }, [brand]);

  function readFile(file: File | undefined, setter: (value: string) => void) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      void shrinkDataImage(String(reader.result ?? ""), 720).then(setter);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved("");
    setSaving(true);
    setBrand({
      name: name.trim() || DEFAULT_BRAND.name,
      logo,
      nameImage,
      nameImageScale,
    });
    const result = await pushStore();
    setSaving(false);
    if (!result.ok) {
      setError(result.error || "Saved on this browser only. Add Upstash Redis in Vercel Marketplace to share the name image with other browsers.");
      return;
    }
    setSaved("Branding saved for every browser. Open the site on another device and refresh.");
  }

  async function handleReset() {
    setName(DEFAULT_BRAND.name);
    setLogo("");
    setNameImage("");
    setNameImageScale(DEFAULT_BRAND.nameImageScale);
    setBrand(DEFAULT_BRAND);
    setError("");
    setSaving(true);
    const result = await pushStore();
    setSaving(false);
    if (!result.ok) {
      setError(result.error || "Reset on this browser only.");
      return;
    }
    setSaved("Reset to the default identity.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="page-title">Branding</h1>
        <p className="page-sub">
          Use a name image in place of written text, or keep the name and place the logo on the right. Saved branding is shared with every device once the live store is connected.
        </p>
      </div>
      <form onSubmit={handleSave} className="panel space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Website name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
            placeholder="Dorth or Dorth Bank"
          />
          <p className="mt-1 text-sm text-[var(--muted)]">
            This is the name that replaces Chise Bank everywhere, including cards and Investments. If you enter Dorth, pages will show Dorth Bank.
          </p>
        </label>

        <div>
          <span className="mb-1 block text-sm text-[var(--muted)]">Name as image</span>
          <p className="mb-2 text-sm text-[var(--muted)]">Upload this if your website name is a graphic instead of words.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => nameImageRef.current?.click()} className="btn-secondary">
              Upload name image
            </button>
            {nameImage && (
              <button type="button" onClick={() => setNameImage("")} className="text-sm font-semibold text-red-700">
                Use written name
              </button>
            )}
          </div>
          <input
            ref={nameImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => readFile(event.target.files?.[0], setNameImage)}
          />
          {nameImage && (
            <label className="mt-3 block">
              <span className="mb-1 block text-sm text-[var(--muted)]">Name image size: {nameImageScale}px</span>
              <input
                type="range"
                min={32}
                max={120}
                value={nameImageScale}
                onChange={(event) => setNameImageScale(Number(event.target.value))}
                className="w-full"
              />
            </label>
          )}
        </div>

        <div>
          <span className="mb-1 block text-sm text-[var(--muted)]">Logo</span>
          <p className="mb-2 text-sm text-[var(--muted)]">This mark stays on the right of the name and is used as the icon when the site is saved as an app.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => logoRef.current?.click()} className="btn-secondary">
              Upload logo
            </button>
            {logo && (
              <button type="button" onClick={() => setLogo("")} className="text-sm font-semibold text-red-700">
                Remove logo
              </button>
            )}
          </div>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => readFile(event.target.files?.[0], setLogo)}
          />
        </div>

        <div className="rounded-xl bg-[var(--page)] p-4">
          <p className="mb-3 text-sm text-[var(--muted)]">Preview</p>
          <div className="flex items-center justify-between rounded-lg bg-[var(--navy)] px-4 py-3">
            <div className="inline-flex items-center gap-3 text-white">
              {nameImage ? (
                <img
                  src={nameImage}
                  alt=""
                  style={{ height: nameImageScale, maxWidth: nameImageScale * 6 }}
                  className="w-auto object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-lg font-semibold">{name || DEFAULT_BRAND.name}</span>
              )}
              {(logo || !nameImage) &&
                (logo ? (
                  <img src={logo} alt="" className="h-8 w-auto max-w-[72px] object-contain" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-[#0b1f3a]">
                    {brandMark(name || DEFAULT_BRAND.name)}
                  </span>
                ))}
            </div>
            <span className="text-sm text-white/70">Receipt</span>
          </div>
        </div>
        {synced === false && (
          <p className="text-sm text-amber-800">
            Other browsers will not see this name image until you add Upstash Redis from the Vercel Marketplace and redeploy.
          </p>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-[var(--blue)]">{saved}</p>}
        <div className="flex flex-wrap gap-2">
          <button disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save branding"}
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset default
          </button>
        </div>
      </form>
    </div>
  );
}
