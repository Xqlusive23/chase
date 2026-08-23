"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Avatar } from "../../components/Avatar";
import { IconChevron } from "../../components/Icons";
import { useBank } from "../../lib/bank-context";
import { signOut } from "../../lib/session";

const LINKS = [
  { href: "/profile/details", label: "Profile details" },
  { href: "/profile/preferences", label: "Preferences" },
  { href: "/profile/security", label: "Security" },
  { href: "/profile/help", label: "FAQ & help" },
  { href: "/support", label: "Contact support" },
  { href: "/support?live=1", label: "Live support" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { username, state, update } = useBank();
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handlePhoto(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update((current) => ({ ...current, avatar: String(reader.result ?? "") }));
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="soft-card flex items-center gap-4 p-5">
        <button type="button" onClick={() => uploadRef.current?.click()} aria-label="Change profile photo">
          <Avatar name={state.displayName} src={state.avatar} size="lg" />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[var(--navy)]">{state.displayName}</h1>
          <p className="text-sm text-[var(--muted)]">@{username}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <button type="button" onClick={() => uploadRef.current?.click()} className="text-sm font-semibold text-[var(--blue)]">
              Upload photo
            </button>
            <button type="button" onClick={() => cameraRef.current?.click()} className="text-sm font-semibold text-[var(--blue)]">
              Take photo
            </button>
          </div>
        </div>
        <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
        <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
      </div>
      {LINKS.map((item) => (
        <Link key={item.href} href={item.href} className="soft-card flex items-center justify-between px-5 py-4 font-semibold">
          {item.label}
          <IconChevron className="h-4 w-4 text-[var(--muted)]" />
        </Link>
      ))}
      <button
        onClick={() => {
          signOut();
          router.replace("/");
        }}
        className="btn-secondary w-full"
      >
        Sign out
      </button>
    </div>
  );
}
