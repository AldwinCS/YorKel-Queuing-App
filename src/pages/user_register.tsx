import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useAuth } from "../hooks/useAuth";
import {
  CONFIRMATION_MESSAGE,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  registrationErrorMessage,
  validateRegistration,
} from "../lib/registration";

function UserRegister() {
  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const showError = (message: string) => {
    setError(message);
    requestAnimationFrame(() => messageRef.current?.focus());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || submitted) return;
    setError("");
    const credentials = { fullName, email, password };
    const validationError = validateRegistration(credentials);
    if (validationError) {
      showError(validationError);
      return;
    }
    submitting.current = true;
    setLoading(true);
    try {
      const result = await signUpNewUser(credentials);
      if (!result.success) {
        showError(result.error);
        return;
      }
      setPassword("");
      if (result.data.session) {
        navigate("/dashboard", { replace: true });
      } else {
        setSubmitted(true);
        requestAnimationFrame(() => successRef.current?.focus());
      }
    } catch {
      showError(registrationErrorMessage());
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="panel p-6 sm:p-9" aria-labelledby="registerTitle">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Join the game
        </p>
        <h1
          id="registerTitle"
          className="text-3xl font-semibold tracking-tight"
        >
          Create your account
        </h1>
        <p className="mt-3 mb-7 text-sm leading-6 text-muted">
          Your next game starts here.
        </p>

        {submitted ? (
          <div
            role="status"
            className="rounded-xl border border-line bg-success-tint p-5 text-sm leading-6"
          >
            <h2
              ref={successRef}
              tabIndex={-1}
              className="mb-2 text-lg font-semibold outline-none"
            >
              Check your email
            </h2>
            <p>{CONFIRMATION_MESSAGE}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-busy={loading}>
            <p
              ref={messageRef}
              tabIndex={-1}
              role={error ? "alert" : undefined}
              className={error ? "form-error" : "sr-only"}
            >
              {error}
            </p>
            <fieldset
              disabled={loading}
              className="min-w-0 space-y-5 disabled:opacity-70"
            >
              <legend className="sr-only">Account details</legend>
              <div>
                <label htmlFor="fullName" className="form-label">
                  Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="JohnDoe@example.com"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    maxLength={MAX_PASSWORD_LENGTH}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-describedby="passwordHelp"
                    placeholder={`${MIN_PASSWORD_LENGTH}+ chars, upper/lower + number`}
                    className="form-input pr-17 placeholder:text-xs sm:placeholder:text-sm"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-controls="password"
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-link absolute inset-y-1 right-1 cursor-pointer px-3 text-xs hover:bg-elevated"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="button-primary w-full"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </fieldset>
          </form>
        )}

        <p className="mt-7 border-t border-line pt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-link">
            Log in
          </Link>
        </p>
      </section>
    </PageShell>
  );
}

export default UserRegister;
