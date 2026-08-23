import Link from "next/link";
import { IconChevron } from "./Icons";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--blue)]">
      <span className="rotate-180">
        <IconChevron className="h-4 w-4" />
      </span>
      {label}
    </Link>
  );
}
