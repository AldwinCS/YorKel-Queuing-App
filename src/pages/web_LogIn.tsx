import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useAuth } from "../hooks/useAuth";

function WebLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInUser({ email, password });
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.status === 429
          ? "Too many login attempts. Please wait a moment and try again."
          : result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="panel p-6 sm:p-9" aria-labelledby="loginTitle">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Back to the court</p>
        <h1 id="loginTitle" className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-3 mb-7 text-sm leading-6 text-muted">Log in to continue to your next game.</p>

        {error && <p role="alert" className="form-error">{error}</p>}
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <fieldset disabled={loading} className="min-w-0 space-y-5 disabled:opacity-70">
            <legend className="sr-only">Login details</legend>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                autoCapitalize="none" spellCheck={false} required value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="JohnDoe@example.com" className="form-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? "text" : "password"}
                  autoComplete="current-password" required value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password" className="form-input pr-14"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-controls="password"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex min-h-11 w-12 cursor-pointer items-center justify-center rounded-r-xl text-muted transition-colors hover:bg-elevated hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                      <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 5a16.8 16.8 0 0 1-2.1 2.6M6.6 6.7A17.6 17.6 0 0 0 3 9s3.5 5 9 5a10.7 10.7 0 0 0 3.4-.6" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                      <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z" /><circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" name="rememberMe" className="h-4 w-4 accent-accent" />Remember me
              </label>
              <a href="#" className="text-link">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading} className="button-primary w-full">
              {loading ? "Logging in..." : "Login"}
            </button>
          </fieldset>
        </form>
        <p className="mt-7 border-t border-line pt-6 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-link">Create account</Link>
        </p>
      </section>
    </PageShell>
  );
}

export default WebLogin;
