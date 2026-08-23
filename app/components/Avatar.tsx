import { initials } from "../lib/format";

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box = size === "lg" ? "h-20 w-20 text-2xl" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (src) {
    return <img src={src} alt="" className={`${box} rounded-full object-cover`} />;
  }

  return (
    <span className={`inline-flex ${box} items-center justify-center rounded-full bg-[var(--sky)] font-bold text-[var(--blue)]`}>
      {initials(name)}
    </span>
  );
}
