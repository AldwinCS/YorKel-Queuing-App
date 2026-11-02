import type { Appearance } from "../context/AppearanceContext";

export const APPEARANCE_STORAGE_KEY = "yorkel.appearance";

function systemAppearance(): "light" | "dark" {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function storedAppearance(): Appearance {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
}

export function applyDocumentAppearance(appearance: Appearance) {
  const resolved = appearance === "system" ? systemAppearance() : appearance;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.appearance = appearance;
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}
