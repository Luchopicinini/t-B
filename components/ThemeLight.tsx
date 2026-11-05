"use client";

import { useEffect } from "react";

export default function ThemeLight() {
  useEffect(() => {
    document.body.classList.add("theme-light");
    return () => document.body.classList.remove("theme-light");
  }, []);
  return null;
}
