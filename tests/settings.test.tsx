import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppearanceProvider } from "../src/context/AppearanceProvider";
import { APPEARANCE_STORAGE_KEY } from "../src/lib/appearance";
import Settings from "../src/pages/settings";
import BackupRestore from "../src/pages/backup_restore";
import Dashboard from "../src/pages/dashboard";
import { PROFILE_STORAGE_KEY } from "../src/lib/profileStorage";

const signOut = vi.fn(async () => ({ success: true as const }));
vi.mock("../src/hooks/useAuth", () => ({
  useAuth: () => ({
    session: { user: { id: "player-test-id" } },
    signOut,
  }),
}));

let mediaDark = false;
const mediaListeners = new Set<() => void>();

function renderSettings() {
  return render(
    <AppearanceProvider>
      <MemoryRouter initialEntries={["/settings"]}>
        <Routes>
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<h1>Login page</h1>} />
          <Route path="/profile" element={<h1>Profile page</h1>} />
          <Route path="/settings/backup" element={<h1>Backup page</h1>} />
        </Routes>
      </MemoryRouter>
    </AppearanceProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  mediaDark = false;
  mediaListeners.clear();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      get matches() { return mediaDark; },
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: (_event: string, listener: () => void) => mediaListeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => mediaListeners.delete(listener),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-appearance");
  document.documentElement.style.removeProperty("color-scheme");
});

describe("settings page", () => {
  it("returns from backup through settings to the dashboard without a history loop", () => {
    render(
      <AppearanceProvider>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/backup" element={<BackupRestore />} />
          </Routes>
        </MemoryRouter>
      </AppearanceProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: /Back up \/ restore profile/ }));
    expect(screen.getByRole("heading", { name: "Back up / restore" })).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Back to settings" }));
    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Back to dashboard" }));
    expect(screen.getByRole("button", { name: "Join a Session" })).toBeTruthy();
  });

  it("applies light, dark, and live system appearance choices", async () => {
    renderSettings();
    fireEvent.click(screen.getByRole("radio", { name: /Dark/ }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("dark");
    expect(screen.queryByRole("status")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: /Light/ }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("light"));
    expect(screen.queryByRole("status")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: /System/ }));
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("system");
    mediaDark = true;
    mediaListeners.forEach((listener) => listener());
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("opens backup and restore as a separate page", async () => {
    renderSettings();
    fireEvent.click(screen.getByRole("link", { name: /Back up \/ restore profile/ }));
    expect(await screen.findByRole("heading", { name: "Backup page" })).toBeTruthy();
  });

  it("requires typed confirmation before deleting local data and signing out", async () => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, "stored profile");
    renderSettings();
    fireEvent.click(screen.getByRole("button", { name: "Delete all user data" }));
    const confirm = screen.getByRole("button", { name: "Permanently delete local data" });
    expect(confirm).toHaveProperty("disabled", true);
    fireEvent.change(screen.getByLabelText("Type DELETE to confirm"), { target: { value: "DELETE" } });
    fireEvent.click(confirm);
    expect(await screen.findByRole("heading", { name: "Login page" })).toBeTruthy();
    expect(signOut).toHaveBeenCalledOnce();
    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();
  });
});
