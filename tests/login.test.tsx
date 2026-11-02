import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import WebLogin from "../src/pages/web_LogIn";

vi.mock("../src/hooks/useAuth", () => ({
  useAuth: () => ({ signInUser: vi.fn() }),
}));

afterEach(cleanup);

describe("login password visibility", () => {
  it("shows and hides the password using an accessible icon button", () => {
    render(<MemoryRouter><WebLogin /></MemoryRouter>);
    const password = screen.getByLabelText("Password") as HTMLInputElement;
    const show = screen.getByRole("button", { name: "Show password" });

    expect(password.type).toBe("password");
    expect(show.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(show);
    expect(password.type).toBe("text");
    const hide = screen.getByRole("button", { name: "Hide password" });
    expect(hide.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(hide);
    expect(password.type).toBe("password");
  });
});
