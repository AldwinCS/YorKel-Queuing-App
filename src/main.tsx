import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContextProvider";
import { AppearanceProvider } from "./context/AppearanceProvider";
import { applyDocumentAppearance, storedAppearance } from "./lib/appearance";

applyDocumentAppearance(storedAppearance());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppearanceProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </AppearanceProvider>
  </StrictMode>,
);
