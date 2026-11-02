import type { SessionSummary } from "../../types/dashboard";
import DashboardIcon from "./DashboardIcon";

export function JoinSessionCard({
  onJoin,
  onHost,
}: {
  onJoin: () => void;
  onHost: () => void;
}) {
  return (
    <section aria-labelledby="getStartedTitle">
      <h2 id="getStartedTitle" className="dashboard-section-title">
        Get started
      </h2>
      <div className="grid gap-4">
        <button
          onClick={onHost}
          className="dashboard-action-card group relative overflow-hidden border-accent bg-accent text-on-accent hover:brightness-110"
          aria-label="Host a Session"
        >
          <span className="dashboard-action-icon bg-black/30 text-white transition-colors group-hover:bg-black/40">
            <DashboardIcon name="plus" className="h-7 w-7" />
          </span>
          <span className="relative z-10 min-w-0 flex-1">
            <span className="block text-xl font-semibold tracking-tight sm:text-2xl">
              Host a Session
            </span>
            <span className="mt-1.5 block max-w-xs text-sm leading-6 text-on-accent">
              Bring your group together for a great game.
            </span>
          </span>
          <DashboardIcon
            name="court"
            className="pointer-events-none absolute -right-4 -bottom-6 h-36 w-36 -rotate-12 text-on-accent/10"
          />
          <DashboardIcon name="chevron" className="relative h-5 w-5 shrink-0" />
        </button>
        <button
          onClick={onJoin}
          className="dashboard-action-card bg-paper text-ink hover:border-line-strong hover:bg-elevated"
          aria-label="Join a Session"
        >
          <span className="dashboard-action-icon bg-elevated text-ink">
            <DashboardIcon name="court" className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xl font-semibold tracking-tight sm:text-2xl">
              Join a Session
            </span>
            <span className="mt-1.5 block text-sm leading-6 text-muted">
              Have a host’s code or QR? Join your next game.
            </span>
          </span>
          <DashboardIcon
            name="chevron"
            className="h-5 w-5 shrink-0 text-ink"
          />
        </button>
      </div>
    </section>
  );
}

export function UpcomingSession({
  session,
  onView,
}: {
  session: SessionSummary;
  onView: () => void;
}) {
  const date = new Date(session.startsAt);
  const day = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    timeZone: "Asia/Manila",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  }).format(date);
  return (
    <section
      id="sessions"
      className="scroll-mt-6"
      aria-labelledby="upcomingTitle"
    >
      <h2 id="upcomingTitle" className="mb-6 text-sm font-semibold">
        Upcoming session
      </h2>
      <button
        onClick={onView}
        className="panel w-full cursor-pointer p-5 text-left transition-colors hover:border-line-strong hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-line text-accent">
              <DashboardIcon name="calendar" />
            </span>
            <h3 className="text-xl font-semibold tracking-tight">
              {session.title}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {day}, {time}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${session.membership === "joined" ? "bg-success-tint text-success-ink" : "bg-elevated text-ink"}`}>
            {session.membership === "joined" ? "Joined" : "Open"}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
          <span>
            {session.playerCount} / {session.capacity} players
          </span>
          <span className="font-semibold text-accent">
            View session <span aria-hidden="true">→</span>
          </span>
        </div>
      </button>
    </section>
  );
}
