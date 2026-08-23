"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { tabIndex } from "../lib/nav";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const direction = useRef("page-enter");

  if (previous.current !== pathname) {
    const from = tabIndex(previous.current);
    const to = tabIndex(pathname);
    direction.current =
      from >= 0 && to >= 0 && from !== to ? (to > from ? "slide-next" : "slide-back") : "page-enter";
    previous.current = pathname;
  }

  return (
    <div key={pathname} className={direction.current}>
      {children}
    </div>
  );
}
