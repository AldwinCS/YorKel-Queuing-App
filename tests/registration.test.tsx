import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContextProvider } from "../src/context/AuthContextProvider";
import UserRegister from "../src/pages/user_register";
import AuthConfirm from "../src/pages/auth_confirm";

const auth = vi.hoisted(() => ({
  signUp: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock("../src/lib/supaBaseClient", () => ({ supabase: { auth } }));

beforeEach(() => {
  auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  auth.getUser.mockResolvedValue({ data: { user: { email_confirmed_at: "2026-10-23" } }, error: null });
  auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  auth.signUp.mockResolvedValue({ data: { user: { id: "new-user" }, session: null }, error: null });
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

function renderRegistration() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <AuthContextProvider>
        <Routes>
          <Route path="/register" element={<UserRegister />} />
          <Route path="/dashboard" element={<p>Player dashboard</p>} />
        </Routes>
      </AuthContextProvider>
    </MemoryRouter>,
  );
}

function fillForm(password = "SecurePass123") {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "  Alex Player  " } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "Alex@Example.COM" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
}

function submit() {
  // Submitting directly also tests validation independently of native HTML checks.
  fireEvent.submit(screen.getByRole("button", { name: "Register" }).closest("form")!);
}

describe("registration through the real auth provider", () => {
  it("sends normalized email and profile metadata, preserves passwords, and waits for confirmation", async () => {
    renderRegistration();
    fillForm(" SecurePass123 ");
    submit();
    await screen.findByText("Check your email");
    expect(auth.signUp).toHaveBeenCalledExactlyOnceWith({
      email: "alex@example.com",
      password: " SecurePass123 ",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: { full_name: "Alex Player" },
      },
    });
    expect(screen.queryByText("Player dashboard")).toBeNull();
    expect(screen.queryByLabelText("Password")).toBeNull();
  });

  it.each([
    ["short1A", "between 8 and 128"],
    ["lowercaseonly123", "uppercase letter"],
    ["A1" + "x".repeat(127), "between 8 and 128"],
  ])("blocks invalid passwords before contacting Auth: %s", async (password, message) => {
    renderRegistration();
    fillForm(password);
    submit();
    expect((await screen.findByRole("alert")).textContent).toContain(message);
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("accepts a password at the eight-character minimum", async () => {
    renderRegistration();
    fillForm("Valid123");
    submit();
    await screen.findByText("Check your email");
    expect(auth.signUp).toHaveBeenCalledTimes(1);
    expect(auth.signUp.mock.calls[0][0].password).toBe("Valid123");
  });

  it("rejects a whitespace-only name", async () => {
    renderRegistration();
    fillForm();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "   " } });
    submit();
    expect((await screen.findByRole("alert")).textContent).toContain("Enter a name");
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it.each([
    ["Name", "Alex\u0001Player", "without control characters"],
    ["Email", "invalid-email", "valid email address"],
  ])("rejects invalid %s even when native browser validation is bypassed", async (field, value, message) => {
    renderRegistration();
    fillForm();
    fireEvent.change(screen.getByLabelText(field), { target: { value } });
    submit();
    expect((await screen.findByRole("alert")).textContent).toContain(message);
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("prevents a second request while signup is pending", async () => {
    let resolveSignup!: (value: unknown) => void;
    auth.signUp.mockReturnValue(new Promise((resolve) => { resolveSignup = resolve; }));
    renderRegistration();
    fillForm();
    const form = screen.getByRole("button", { name: "Register" }).closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(auth.signUp).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Creating account..." }).hasAttribute("disabled")).toBe(true);
    resolveSignup({ data: { user: { id: "new-user" }, session: null }, error: null });
    await screen.findByText("Check your email");
  });

  it.each(["user_already_exists", "email_exists"])("does not disclose duplicate accounts (%s)", async (code) => {
    auth.signUp.mockResolvedValue({ data: {}, error: { code, status: 422, message: "User already registered" } });
    renderRegistration();
    fillForm();
    submit();
    await screen.findByText("Check your email");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("User already registered")).toBeNull();
  });

  it("handles Supabase's obfuscated duplicate response like a pending confirmation", async () => {
    auth.signUp.mockResolvedValue({ data: { user: { id: "fake", identities: [] }, session: null }, error: null });
    renderRegistration();
    fillForm();
    submit();
    await screen.findByText("Check your email");
    expect(screen.queryByText("Player dashboard")).toBeNull();
  });

  it.each([
    [429, "over_request_rate_limit", "Too many registration attempts"],
    [422, "weak_password", "Choose a stronger password"],
    [500, "unexpected_failure", "Unable to complete registration"],
    [422, "email_address_invalid", "Check your email address"],
  ])("handles Auth errors without displaying raw details (%s, %s)", async (status, code, expected) => {
    auth.signUp.mockResolvedValue({ data: {}, error: { status, code, message: "INTERNAL database details" } });
    renderRegistration();
    fillForm();
    submit();
    expect((await screen.findByRole("alert")).textContent).toContain(expected);
    expect(screen.queryByText("INTERNAL database details")).toBeNull();
    expect(screen.getByRole("button", { name: "Register" }).hasAttribute("disabled")).toBe(false);
  });

  it("recovers from a network failure and allows retry", async () => {
    auth.signUp.mockRejectedValueOnce(new Error("private network details"));
    renderRegistration();
    fillForm();
    submit();
    expect((await screen.findByRole("alert")).textContent).toContain("Check your connection");
    submit();
    await screen.findByText("Check your email");
  });

  it("navigates to the dashboard only when Auth returns a session", async () => {
    auth.signUp.mockResolvedValue({ data: { user: { id: "new-user" }, session: { access_token: "test-token" } }, error: null });
    renderRegistration();
    fillForm();
    submit();
    await screen.findByText("Player dashboard");
  });
});

describe("email confirmation callback", () => {
  function renderCallback() {
    render(<MemoryRouter initialEntries={["/auth/confirm"]}><Routes>
      <Route path="/auth/confirm" element={<AuthConfirm />} />
      <Route path="/dashboard" element={<p>Confirmed dashboard</p>} />
    </Routes></MemoryRouter>);
  }

  it("verifies the user before navigating and removes tokens from the URL", async () => {
    window.history.replaceState(null, "", "/auth/confirm#access_token=example");
    auth.getSession.mockResolvedValue({ data: { session: { access_token: "example" } }, error: null });
    renderCallback();
    await screen.findByText("Confirmed dashboard");
    expect(auth.getUser).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe("");
  });

  it("shows an actionable error when there is no session", async () => {
    renderCallback();
    expect((await screen.findByRole("alert")).textContent).toContain("invalid or has expired");
    expect(screen.queryByText("Confirmed dashboard")).toBeNull();
  });

  it("rejects a failed confirmation link even with an existing session", async () => {
    window.history.replaceState(null, "", "/auth/confirm#error=access_denied&error_description=private");
    auth.getSession.mockResolvedValue({ data: { session: { access_token: "existing" } }, error: null });
    renderCallback();
    expect((await screen.findByRole("alert")).textContent).toContain("invalid or has expired");
    expect(auth.getUser).not.toHaveBeenCalled();
    expect(window.location.hash).toBe("");
  });

  it("does not accept an unverified user", async () => {
    auth.getSession.mockResolvedValue({ data: { session: {} }, error: null });
    auth.getUser.mockResolvedValue({ data: { user: { email_confirmed_at: null } }, error: null });
    renderCallback();
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("could not verify"));
    expect(screen.queryByText("Confirmed dashboard")).toBeNull();
  });
});
