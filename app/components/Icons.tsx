type IconProps = { className?: string };

export function IconMessages({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 8.5A3.5 3.5 0 0 1 8.5 5h7A3.5 3.5 0 0 1 19 8.5v3A3.5 3.5 0 0 1 15.5 15H10l-4 3v-3.2A3.5 3.5 0 0 1 5 11.5v-3Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 10h6M9 12.5h3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconProfile({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.4 16.4c1.2-1.6 2.7-2.4 4.6-2.4s3.4.8 4.6 2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconWallet({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.2" cy="14.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function IconPay({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 12a5 5 0 0 1 8.3-3.7M17 12a5 5 0 0 1-8.3 3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 6.5v3h-3M7.5 17.5v-3h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlan({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconTag({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.8 12.2 12 5l7.2 7.2-5.4 5.4a2 2 0 0 1-2.8 0L4.8 12.2Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="14.2" cy="9.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconMenu({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevron({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m12 4.5 2.1 4.3 4.7.7-3.4 3.3.8 4.7L12 15.3 7.8 17.5l.8-4.7-3.4-3.3 4.7-.7L12 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChart({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 16.5 9 12l3.5 3.5L20 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7.5h4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAlert({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="15.6" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconDoc({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 4.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 4.5V9h4.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconBulb({ className = "h-12 w-12" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M12 18h-6M42 18h-6M24 8V3M10 10 6 7M38 10l4-3" stroke="#117aca" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="22" r="11" fill="#f5c518" />
      <path d="M18 34.5h12M19.5 38.5h9" stroke="#117aca" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconMoneyIn({ className = "h-12 w-12" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="12" width="28" height="18" rx="3" fill="#0b5cab" />
      <rect x="14" y="18" width="28" height="18" rx="3" fill="#1b8a4a" />
      <circle cx="28" cy="27" r="5.5" fill="white" />
      <path d="M28 24v6M26 25.2c.6-.6 1.3-.9 2-.9 1.3 0 2.2.7 2.2 1.7 0 2.3-4.2 1.4-4.2 3.2 0 .8.8 1.4 2 1.4.8 0 1.5-.3 2-.8" stroke="#1b8a4a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconCreditCard({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="12" width="36" height="24" rx="4" fill="#0b5cab" />
      <path d="M6 20h36" stroke="#084a89" strokeWidth="4" />
      <rect x="11" y="27" width="10" height="4" rx="1" fill="white" />
    </svg>
  );
}

export function IconChecking({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="9" y="10" width="30" height="28" rx="3" fill="#0b5cab" />
      <path d="M15 20h18M15 25h14M15 30h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconPiggy({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <ellipse cx="24" cy="26" rx="14" ry="10" fill="#0b5cab" />
      <circle cx="32" cy="24" r="2" fill="white" />
      <path d="M10 26h-3M35 20c2 0 5 2 5 5" stroke="#0b5cab" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 35v4M30 35v4" stroke="#084a89" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="12" r="3" fill="#f5c518" />
    </svg>
  );
}

export function IconBriefcase({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="8" y="18" width="32" height="20" rx="3" fill="#0b5cab" />
      <path d="M18 18v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" stroke="#0b5cab" strokeWidth="3" />
      <path d="M8 26h32" stroke="#084a89" strokeWidth="3" />
    </svg>
  );
}
