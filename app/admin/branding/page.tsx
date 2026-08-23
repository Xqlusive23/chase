"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useBrand } from "../../components/BrandProvider";
import { DEFAULT_BRAND, brandMark } from "../../lib/brand";

export default function AdminBrandingPage() {
  const { brand, setBrand } = useBrand();
  const logoRef = useRef<HTMLInputElement>(null);
  const nameImageRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(brand.name);
  const [logo, setLogo] = useState(brand.logo);
  const [nameImage, setNameImage] = useState(brand.nameImage);
  const [nameImageScale, setNameImageScale] = useState(brand.nameImageScale || 56);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setName(brand.name);
    setLogo(brand.logo);
    setNameImage(brand.nameImage);
    setNameImageScale(brand.nameImageScale || 56);
  }, [brand]);

  function readFile(file: File | undefined, setter: (value: string) => void) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();
    setBrand({
      name: name.trim() || DEFAULT_BRAND.name,
      logo,
      nameImage,
      nameImageScale,
    });
    setSaved("Branding saved. The name and name image now update everywhere they appear.");
  }

  function handleReset() {
    setName(DEFAULT_BRAND.name);
    setLogo("");
    setNameImage("");
    setNameImageScale(DEFAULT_BRAND.nameImageScale);
    setBrand(DEFAULT_BRAND);
    setSaved("Reset to the default identity.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="page-title">Branding</h1>
        <p className="page-sub">
          Use a name image in place of written text, or keep the name and place the logo on the right.
        </p>
      </div>
      <form onSubmit={handleSave} className="panel space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--muted)]">Website name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
            placeholder="Used in page copy wherever the bank name appears"
          />
          <p className="mt-1 text-sm text-[var(--muted)]">
            This written name replaces Chise Bank in sentences and account names. A name image is only used in headers.
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
        {saved && <p className="text-sm text-[var(--blue)]">{saved}</p>}
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary">Save branding</button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset default
          </button>
        </div>
      </form>
    </div>
  );
}
