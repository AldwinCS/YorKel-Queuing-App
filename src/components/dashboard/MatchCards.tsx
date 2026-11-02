import { useId } from "react";
import type { PlayerMatch, PlayerStatus, RecentMatch } from "../../types/dashboard";

export function NextMatchCard({ match, status, onReady }: { match: PlayerMatch; status: PlayerStatus; onReady: () => void }) {
  const playing = status === "playing";
  return (
    <section className="panel border-accent/30 p-5 sm:p-6" aria-labelledby="nextMatchTitle">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="nextMatchTitle" className="text-base font-semibold">{playing ? "Current Match" : "Next Match"}</h2>
        <span className="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-accent-dark">{playing ? "Playing" : "Up Next"}</span>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm"><span className="font-semibold text-accent">{match.court}</span><span aria-hidden="true" className="text-line">/</span><span className="capitalize text-muted">{match.type}</span></div>
      <div className="my-5 rounded-2xl bg-canvas p-5 text-center">
        <p className="break-words text-lg font-semibold">{match.team.join(" + ")}</p>
        <p className="my-2 text-xs text-muted">vs</p>
        <p className="break-words text-lg font-semibold">{match.opponents.join(" + ")}</p>
      </div>
      {status === "waiting" && <button className="button-primary w-full" onClick={onReady}>I'm Ready</button>}
      {status === "ready" && <p role="status" className="text-center text-sm font-semibold text-accent-dark">You're ready for this match.</p>}
      {playing && <p className="text-center text-xs text-muted">Your match is in progress.</p>}
    </section>
  );
}

export function RecentMatches({ matches, onViewAll }: { matches: RecentMatch[]; onViewAll?: () => void }) {
  const headingId = useId();
  return (
    <section id={onViewAll ? "matches" : undefined} className="scroll-mt-6" aria-labelledby={headingId}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 id={headingId} className="text-sm font-semibold">Recent Matches</h2>
        {onViewAll && <button className="text-link min-h-11 cursor-pointer px-2 text-xs" onClick={onViewAll}>View all</button>}
      </div>
      <ul className="panel divide-y divide-line px-5">
        {matches.map((match) => (
          <li key={match.id} className="flex items-center justify-between gap-3 py-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${match.result === "win" ? "bg-tint text-accent-dark" : "bg-canvas text-muted"}`}>{match.result === "win" ? "Win" : "Loss"}</span><span className="text-xs capitalize text-muted">{match.type}</span></div>
              <p className="mt-1 text-xs text-muted">{match.sessionTitle}</p>
            </div>
            <p className="shrink-0 text-xl font-semibold tabular-nums">{match.score[0]}<span className="mx-1 text-line">–</span>{match.score[1]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
