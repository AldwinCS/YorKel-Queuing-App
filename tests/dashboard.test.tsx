import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import Dashboard from "../src/pages/dashboard";
import PreferenceForm from "../src/components/dashboard/PreferenceForm";
import { NextMatchCard } from "../src/components/dashboard/MatchCards";
import { mockDoublesMatch, mockSinglesMatch } from "../src/data/dashboardMock";
import PlayerProfile from "../src/components/dashboard/PlayerProfile";
import { mockPlayer } from "../src/data/dashboardMock";
import UserProfile from "../src/pages/user_profile";

vi.mock("../src/hooks/useAuth", () => ({ useAuth: () => ({ signOut: vi.fn() }) }));

// jsdom has no native dialog implementation. Emulate its open/close events;
// focus trapping and native Escape behavior still require a real browser.
beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value: function (this: HTMLDialogElement) { this.open = true; } },
    close: { configurable: true, value: function (this: HTMLDialogElement) { this.open = false; this.dispatchEvent(new Event("close")); } },
  });
});
afterEach(cleanup);
afterAll(() => {
  Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

function renderDashboard() {
  render(<MemoryRouter><Dashboard /></MemoryRouter>);
}

function showLiveState() {
  fireEvent.click(screen.getByRole("button", { name: "Join a Session" }));
  fireEvent.change(screen.getByLabelText("Session code"), { target: { value: "DEMO01" } });
  fireEvent.click(screen.getByRole("button", { name: "Join demo session" }));
}

describe("player dashboard preview", () => {
  it("prioritizes joining without an active session and identifies sample data", () => {
    renderDashboard();
    expect(screen.getByRole("button", { name: "Join a Session" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Host a Session" })).toBeTruthy();
    expect(screen.getByText("PREVIEW · SAMPLE DATA")).toBeTruthy();
    expect(screen.queryByText("LIVE")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Next Match" })).toBeNull();
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
  });

  it("only joins the demo after the sample code is entered", () => {
    renderDashboard();
    fireEvent.click(screen.getByRole("button", { name: "Join a Session" }));
    fireEvent.change(screen.getByLabelText("Session code"), { target: { value: "WRONG" } });
    fireEvent.click(screen.getByRole("button", { name: "Join demo session" }));
    expect(screen.getByRole("alert").textContent).toContain("DEMO01");
    expect(screen.queryByText("LIVE")).toBeNull();
    fireEvent.change(screen.getByLabelText("Session code"), { target: { value: " demo01 " } });
    fireEvent.click(screen.getByRole("button", { name: "Join demo session" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("LIVE")).toBeTruthy();
    expect(screen.getByText("WAITING")).toBeTruthy();
    expect(screen.getByText("#3")).toBeTruthy();
  });

  it("supports resting and rejoining without showing a stale match while resting", () => {
    renderDashboard();
    showLiveState();
    fireEvent.click(screen.getByRole("button", { name: "Take a Rest" }));
    expect(screen.getByText("RESTING")).toBeTruthy();
    expect(screen.getByText("Not in queue")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Next Match" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Rejoin Queue" }));
    expect(screen.getByText("WAITING")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Next Match" })).toBeTruthy();
  });

  it("shows ready and playing states with appropriate match actions", () => {
    renderDashboard();
    showLiveState();
    const match = screen.getByRole("region", { name: "Next Match" });
    fireEvent.click(within(match).getByRole("button", { name: "I'm Ready" }));
    expect(screen.getByText("READY")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "I'm Ready" })).toBeNull();
    cleanup();
    render(<NextMatchCard match={mockDoublesMatch} status="playing" onReady={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Current Match" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Take a Rest" })).toBeNull();
    expect(screen.queryByText("#3")).toBeNull();
  });

  it("changes session preferences without changing skill or an assigned match", () => {
    renderDashboard();
    showLiveState();
    fireEvent.click(screen.getByRole("button", { name: "Change Preference" }));
    fireEvent.change(screen.getByLabelText("Opponent preference"), { target: { value: "lower" } });
    fireEvent.change(screen.getByLabelText("Match type preference"), { target: { value: "either" } });
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
    expect(screen.getByText("Intermediate")).toBeTruthy();
    expect(screen.getByText("Lower")).toBeTruthy();
    expect(screen.getByText("Either")).toBeTruthy();
    expect(screen.getByText("Alex + Ben")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders singles lineups using the same match card", () => {
    render(<NextMatchCard match={mockSinglesMatch} status="waiting" onReady={vi.fn()} />);
    const card = screen.getByRole("region", { name: "Next Match" });
    expect(within(card).getByText("Alex")).toBeTruthy();
    expect(within(card).getByText("Ben")).toBeTruthy();
    expect(screen.queryByText("Carlo + David")).toBeNull();
  });

  it("links to a separate profile page and keeps history in a dialog", () => {
    render(<MemoryRouter initialEntries={["/dashboard"]}><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/profile" element={<UserProfile />} /></Routes></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Profile", exact: true }).getAttribute("href")).toBe("/profile");
    fireEvent.click(screen.getByRole("button", { name: "View profile" }));
    expect(screen.getByRole("heading", { name: "Player profile" })).toBeTruthy();
    expect(screen.queryByRole("dialog", { name: "Your profile" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Sign out" })).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: "Back to dashboard" }));
    expect(screen.getByRole("button", { name: "Join a Session" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "View all" }));
    expect(within(screen.getByRole("dialog")).getAllByRole("listitem")).toHaveLength(4);
  });

  it("restricts match preferences to the types supported by a session", () => {
    const save = vi.fn();
    render(<PreferenceForm sessionMatchTypes="singles" preferences={{ opponent: "same", matchType: "either" }} onSave={save} />);
    expect(within(screen.getByLabelText("Match type preference")).getAllByRole("option")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
    expect(save).toHaveBeenCalledWith({ opponent: "same", matchType: "singles" });
  });

  it("shows profile statistics and activity, and filters them with match history", () => {
    render(<MemoryRouter><UserProfile /></MemoryRouter>);
    const profile = within(screen.getByRole("main"));
    expect(profile.getByRole("link", { name: "Back to dashboard" })).toBeTruthy();
    fireEvent.click(profile.getByRole("button", { name: "Edit profile" }));
    expect(profile.getByRole("status").textContent).toContain("future update");
    expect(profile.getByText("75%")).toBeTruthy();
    expect(profile.getByText("You’ve played 1h 32m across 2 sessions and faced 4 opponents.")).toBeTruthy();
    expect(profile.getAllByRole("listitem")).toHaveLength(4);
    fireEvent.click(profile.getByRole("button", { name: "Singles", exact: true }));
    expect(profile.getByText("50%")).toBeTruthy();
    expect(profile.getByText("You’ve played 48m across 2 sessions and faced 2 opponents.")).toBeTruthy();
    expect(profile.getAllByRole("listitem")).toHaveLength(2);
    expect(profile.getByRole("button", { name: "Singles", exact: true }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(profile.getByRole("button", { name: "Doubles", exact: true }));
    expect(profile.getByText("100%")).toBeTruthy();
    expect(profile.getByText("You’ve played 44m across 2 sessions and faced 3 opponents.")).toBeTruthy();
  });

  it("handles a player with no match history without a misleading win rate", () => {
    render(<PlayerProfile player={mockPlayer} matches={[]} />);
    expect(screen.getByText("—")).toBeTruthy();
    expect(screen.getByText("No completed matches yet.")).toBeTruthy();
    expect(screen.getByText("You’ve played 0m across 0 sessions and faced 0 opponents.")).toBeTruthy();
  });
});
