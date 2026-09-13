import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function WebLogin() {
  // FORM STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // AUTH CONTEXT
  const { signInUser } = useAuth();

  // NAVIGATION
  const navigate = useNavigate();

  // LOGIN
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signInUser({
        email,
        password,
      });

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        flex min-h-screen items-center justify-center
        bg-[#f4f6f8]
        font-[Arial,sans-serif]
        min-[600px]:p-7.5
      "
    >
      <div
        className="
          flex min-h-screen w-full flex-col justify-center
          bg-white px-6 py-10

          min-[600px]:min-h-0
          min-[600px]:max-w-105
          min-[600px]:rounded-[20px]
          min-[600px]:px-10
          min-[600px]:py-11.25
          min-[600px]:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        "
      >
        {/* LOGO */}
        <div
          className="
            mb-7.5
            flex h-16 w-16 items-center justify-center
            rounded-2xl
            bg-[#2563eb]
            text-[26px] font-bold text-white
          "
        >
          B
        </div>

        {/* TITLE */}
        <h1 className="mb-2 text-[28px] font-bold text-[#111827]">
          Welcome Back
        </h1>

        <p className="mb-7.5 text-[15px] text-[#6b7280]">
          Login to continue to Badminton Queue.
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-4.5">
            <label
              htmlFor="email"
              className="
                mb-2 block
                text-sm font-semibold
                text-[#374151]
              "
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required

              value={email}

              onChange={(event) =>
                setEmail(event.target.value)
              }

              className="
                h-13 w-full
                rounded-xl
                border border-[#d1d5db]
                bg-white
                px-3.5
                text-base text-[#111827]
                outline-none
                placeholder:text-gray-400
                focus:border-[#2563eb]
              "
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4.5">
            <label
              htmlFor="password"
              className="
                mb-2 block
                text-sm font-semibold
                text-[#374151]
              "
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required

              value={password}

              onChange={(event) =>
                setPassword(event.target.value)
              }

              className="
                h-13 w-full
                rounded-xl
                border border-[#d1d5db]
                bg-white
                px-3.5
                text-base text-[#111827]
                outline-none
                placeholder:text-gray-400
                focus:border-[#2563eb]
              "
            />
          </div>

          {/* OPTIONS */}
          <div
            className="
              mb-6
              flex items-center justify-between
              text-sm
            "
          >
            <label
              className="
                flex items-center
                gap-1.75
                text-[#374151]
              "
            >
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4"
              />

              Remember me
            </label>
            {/* FORGOT PASSWORD */}
            <a
              href="#"
              className="
                text-[#2563eb]
                no-underline
                hover:underline
              "
            >
              Forgot password?
            </a>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              h-13 w-full
              cursor-pointer
              rounded-xl
              border-0
              bg-[#2563eb]
              text-base font-semibold text-white
              transition-colors
              hover:bg-[#1d4ed8]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="mt-7 text-center text-sm text-[#6b7280]">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="
              font-semibold
              text-[#2563eb]
              no-underline
              hover:underline
            "
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default WebLogin;