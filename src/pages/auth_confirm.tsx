import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supaBaseClient";
import PageShell from "../components/PageShell";

export default function AuthConfirm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const linkFailed = new URLSearchParams(window.location.hash.slice(1)).has("error") ||
      new URLSearchParams(window.location.search).has("error");
    // Supabase initializes the session from the confirmation URL before
    // getSession resolves. Never render or log tokens or URL error details.
    const confirm = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        window.history.replaceState(null, "", window.location.pathname);
        if (linkFailed || sessionError || !data.session) {
          setError("This confirmation link is invalid or has expired. Try logging in, or register again to request another confirmation email.");
          return;
        }
        const { error: userError, data: userData } = await supabase.auth.getUser();
        if (!active) return;
        if (userError || !userData.user?.email_confirmed_at) {
          setError("We could not verify your email. Please try logging in again.");
          return;
        }
        navigate("/dashboard", { replace: true });
      } catch {
        if (active) setError("Unable to verify your email right now. Check your connection and try logging in again.");
      }
    };
    void confirm();
    return () => { active = false; };
  }, [navigate]);

  return (
    <PageShell>
      <section className="panel p-6 sm:p-9" aria-labelledby="confirmTitle">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">One last step</p>
        <h1 id="confirmTitle" className="mb-4 text-2xl font-semibold tracking-tight">Email confirmation</h1>
        <p role={error ? "alert" : "status"} className={error ? "form-error" : "text-sm leading-6 text-muted"}>{error || "Confirming your email..."}</p>
        {error && <Link to="/login" className="button-primary mt-2 w-full">Go to login</Link>}
      </section>
    </PageShell>
  );
}
