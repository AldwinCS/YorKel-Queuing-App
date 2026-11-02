import { createContext } from "react";

export type Appearance = "light" | "dark" | "system";

export type AppearanceContextValue = {
  appearance: Appearance;
  resolvedAppearance: "light" | "dark";
  setAppearance: (appearance: Appearance) => void;
};

export const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);
