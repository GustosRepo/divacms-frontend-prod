"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AutoFocusOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.getElementById("content");
    if (el) {
      // make focusable then focus, then remove tabindex to avoid tab trap
      const prevTab = el.getAttribute("tabindex");
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
      if (prevTab === null) {
        // leave -1; it is okay to keep -1 so it can be focused programmatically
      }
    }
  }, [pathname]);

  return null;
}
