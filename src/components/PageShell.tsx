import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type PageShellProps = {
  children: ReactNode;
  wide?: boolean;
  action?: ReactNode;
};

export default function PageShell({
  children,
  wide = false,
  action,
}: PageShellProps) {
  return (
    <main className="auth-shell min-h-svh bg-canvas text-ink">
      <header className="auth-header">
        <Link
          to="/"
          aria-label="YorKel home"
          className="brand-lockup focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span
            aria-hidden="true"
            className="brand-monogram"
          >
            Y
          </span>
          <span className="text-lg font-semibold tracking-tight">
            YorKel<span className="text-accent">.</span>
          </span>
        </Link>
        {action || <span className="auth-edition">COURT / QUEUE / PLAY</span>}
      </header>

      <div className="auth-layout">
        <aside className="auth-story" aria-hidden="true">
          <div>
            <p className="auth-story-index">YOUR COURT IS CALLING / 01</p>
            <p className="auth-story-title">Less waiting.<br /><span>More playing.</span></p>
          </div>
          <div className="auth-court-lines">
            <span /><span /><span />
          </div>
          <p className="auth-story-note">One place for every player, court, and next match.</p>
        </aside>
        <div className={`auth-content ${wide ? "max-w-5xl" : "max-w-120"}`}>
          {children}
        </div>
      </div>
    </main>
  );
}
