export const APP_TABS = [
  { href: "/dashboard", label: "Accounts" },
  { href: "/payments", label: "Pay & transfer" },
  { href: "/transactions", label: "Plan & track" },
  { href: "/benefits", label: "Benefits & travel" },
  { href: "/investments", label: "Investments" },
] as const;

export function tabIndex(pathname: string) {
  return APP_TABS.findIndex((tab) => tab.href === pathname);
}

export function isSwipeablePath(pathname: string) {
  return tabIndex(pathname) >= 0;
}
