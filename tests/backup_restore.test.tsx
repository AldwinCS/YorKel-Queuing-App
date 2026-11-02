import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BackupRestore from "../src/pages/backup_restore";
import { PROFILE_STORAGE_KEY, defaultProfileData } from "../src/lib/profileStorage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/settings/backup"]}>
      <BackupRestore />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(async () => undefined) },
  });
});

afterEach(cleanup);

describe("backup and restore page", () => {
  it("shows a back link on small screens and returns to settings from a direct visit", () => {
    render(
      <MemoryRouter initialEntries={["/settings/backup"]}>
        <Routes>
          <Route path="/settings/backup" element={<BackupRestore />} />
          <Route path="/settings" element={<h1>Settings page</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    const backLink = screen.getByRole("link", { name: "Back to settings" });
    expect(backLink.getAttribute("href")).toBe("/settings");
    expect(backLink.textContent).toContain("Back");
    fireEvent.click(backLink);
    expect(screen.getByRole("heading", { name: "Settings page" })).toBeTruthy();
  });

  it("creates a recovery code and restores the encoded profile", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Create my recovery code" }));

    const code = (screen.getByLabelText("Your recovery code") as HTMLTextAreaElement).value;
    expect(code.length).toBeGreaterThan(20);

    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    fireEvent.click(screen.getByRole("button", { name: "Paste code" }));
    fireEvent.change(screen.getByLabelText("Recovery code"), { target: { value: code } });
    fireEvent.click(screen.getByRole("button", { name: "Restore this profile" }));

    expect((await screen.findByRole("status")).textContent).toContain("profile was restored");
    expect(JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) || "{}").player.id).toBe(defaultProfileData().player.id);
  });

  it("rejects an invalid recovery code without replacing profile data", async () => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfileData()));
    const original = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Paste code" }));
    fireEvent.change(screen.getByLabelText("Recovery code"), { target: { value: "not-valid***" } });
    fireEvent.click(screen.getByRole("button", { name: "Restore this profile" }));

    expect((await screen.findByRole("alert")).textContent).toBe("Enter a valid YorKel recovery code.");
    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBe(original);
  });

  it("restores a valid JSON backup file", async () => {
    renderPage();
    const profile = {
      player: { id: "restored-id", name: "Restored Player", skillLevel: "Advanced" as const },
      matches: [],
    };
    const json = JSON.stringify({ app: "YorKel", version: 1, exportedAt: "2026-10-27T00:00:00.000Z", profile });
    const file = new File([json], "backup.json", { type: "application/json" });
    Object.defineProperty(file, "text", { value: async () => json });

    fireEvent.change(screen.getByLabelText("Choose profile backup"), { target: { files: [file] } });

    expect((await screen.findByRole("status")).textContent).toBe("Restored Player's profile was restored.");
    expect(JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) || "{}").player.id).toBe("restored-id");
  });
});
