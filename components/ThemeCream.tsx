"use client";

import { useEffect } from "react";

export default function ThemeCream() {
  useEffect(() => {
    document.body.classList.add("theme-cream");
    return () => document.body.classList.remove("theme-cream");
  }, []);
  return null;
}