import type { FormEvent } from "react";
import { Link } from "react-router-dom";

function UserRegister() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Registration form submitted");
  };

  return (
    <main
      className="
        flex min-h-screen items-center justify-center
        bg-[#f4f6f8] p-5
        font-[Arial,sans-serif]
      "
    >
      <div
        className="
          w-full max-w-105
          rounded-[14px] bg-white
          px-6 py-7
          shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        "
      >
        {/* TITLE */}
        <h1 className="mb-2 text-center text-[28px] font-bold text-black">
          Create Account
        </h1>

        <p className="mb-6 text-center text-sm text-[#666]">
          Register to join badminton sessions and matches.
        </p>

        <form id="registerForm" onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-bold text-black"
            >
              Full Name
            </label>

            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              required
              className="
                w-full rounded-lg border border-[#ccc]
                bg-white p-3 text-base text-black
                outline-none
                placeholder:text-[#888]
                focus:border-[#555]
              "
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-bold text-black"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              className="
                w-full rounded-lg border border-[#ccc]
                bg-white p-3 text-base text-black
                outline-none
                placeholder:text-[#888]
                focus:border-[#555]
              "
            />
          </div>

          {/* SKILL LEVEL */}
          <div className="mb-4">
            <label
              htmlFor="skillLevel"
              className="mb-1.5 block text-sm font-bold text-black"
            >
              Skill Level
            </label>

            <select
              id="skillLevel"
              name="skillLevel"
              required
              defaultValue=""
              className="
                w-full rounded-lg border border-[#ccc]
                bg-white p-3 text-base text-black
                outline-none
                focus:border-[#555]
              "
            >
              <option value="" disabled>
                Select your skill level
              </option>

              <option value="beginner">
                Beginner
              </option>

              <option value="intermediate">
                Intermediate
              </option>

              <option value="advanced">
                Advanced
              </option>

              <option value="pro">
                Pro
              </option>
            </select>
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-bold text-black"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Minimum 8 characters"
              minLength={8}
              required
              className="
                w-full rounded-lg border border-[#ccc]
                bg-white p-3 text-base text-black
                outline-none
                placeholder:text-[#888]
                focus:border-[#555]
              "
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-bold text-black"
            >
              Confirm Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              required
              className="
                w-full rounded-lg border border-[#ccc]
                bg-white p-3 text-base text-black
                outline-none
                placeholder:text-[#888]
                focus:border-[#555]
              "
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="
              mt-1.5 w-full cursor-pointer
              rounded-lg border-0
              bg-[#111827] p-3.25
              text-base font-bold text-white
              transition-colors
              hover:bg-[#1f2937]
            "
          >
            Register
          </button>

          {/* FORM MESSAGE */}
          <p
            id="formMessage"
            className="mt-4 min-h-5 text-center text-sm"
          ></p>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-5 text-center text-sm text-[#666]">
          Already have an account?{" "}

          <Link
            to="/login"
            className="
              font-bold text-[#111827]
              no-underline
              hover:underline
            "
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default UserRegister;