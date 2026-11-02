import { useEffect, useState, type ReactNode } from "react";
import { AppearanceContext, type Appearance } from "./AppearanceContext";
import { APPEARANCE_STORAGE_KEY, applyDocumentAppearance, storedAppearance } from "../lib/appearance";

function systemAppearance(): "light" | "dark" {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>(storedAppearance);
  const [resolvedAppearance, setResolvedAppearance] = useState<"light" | "dark">(() =>
    appearance === "system" ? systemAppearance() : appearance,
  );

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const sync = () => setResolvedAppearance(applyDocumentAppearance(appearance));
    sync();
    if (appearance !== "system" || !media) return;
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [appearance]);

  const setAppearance = (next: Appearance) => {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, next);
    setAppearanceState(next);
  };

  return (
    <AppearanceContext.Provider value={{ appearance, resolvedAppearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}
