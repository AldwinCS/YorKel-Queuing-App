import { useState } from "react";
import type { DashboardPlayer, MatchType, RecentMatch } from "../../types/dashboard";
import DashboardIcon from "./DashboardIcon";

export default function PlayerProfile({ player, matches }: { player: DashboardPlayer; matches: RecentMatch[] }) {
  const [filter, setFilter] = useState<MatchType | "all">("all");
  const history = matches.filter((match) => filter === "all" || match.type === filter)
    .sort((a, b) => Date.parse(b.playedAt) - Date.parse(a.playedAt));
  const won = history.filter((match) => match.result === "win").length;
  const sessions = new Set(history.map((match) => match.sessionId)).size;
  const minutes = history.reduce((sum, match) => sum + match.durationMinutes, 0);
  const opponents = new Set(history.flatMap((match) => match.opponentIds)).size;
  const playTime = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
  const initials = player.name.split(" ").map((name) => name[0]).slice(0, 2).join("");

  return (
    <div className="space-y-7">
      <div className="player-profile-hero relative flex items-center gap-4 overflow-hidden rounded-3xl border border-accent/20 bg-tint p-5 sm:gap-6 sm:p-7">
        <span aria-hidden="true" className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-4 border-paper bg-accent text-xl font-semibold text-on-accent ring-1 ring-accent/30 sm:h-24 sm:w-24 sm:text-2xl">{initials}</span>
        <div className="relative z-10 min-w-0"><h3 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">{player.name}</h3><p className="mt-2 inline-flex rounded-full border border-accent/20 bg-paper px-3 py-1 text-xs font-semibold text-accent">{player.skillLevel || "Skill level not set"}</p></div>
        <DashboardIcon name="trophy" className="pointer-events-none absolute -right-4 -bottom-6 h-36 w-36 -rotate-12 text-accent/10" />
      </div>

      <section aria-labelledby="profileStatsTitle">
        <div className="mb-4 flex items-center justify-between gap-3"><h3 id="profileStatsTitle" className="text-lg font-semibold">Player statistics</h3><span className="rounded-full border border-line px-3 py-1 text-[10px] font-semibold tracking-wider text-muted">ALL TIME</span></div>
        <div className="rounded-3xl border border-line p-4 sm:p-6">
          <div role="group" aria-label="Match type filter" className="mb-5 flex flex-wrap gap-2">
            {([ ["all", "All matches"], ["singles", "Singles"], ["doubles", "Doubles"] ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${filter === value ? "border-accent bg-accent text-on-accent" : "border-line text-muted hover:bg-tint"}`}>{label}</button>)}
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite" aria-atomic="true">
            {[["Played", history.length], ["Won", won], ["Lost", history.length - won], ["Win rate", history.length ? `${Math.round(won / history.length * 100)}%` : "—"]].map(([label, value]) => <div key={label} className={`flex flex-col-reverse gap-2 rounded-2xl px-2 py-4 text-center ${label === "Win rate" ? "border border-accent/20 bg-tint" : "bg-canvas"}`}><dt className="text-xs text-muted">{label}</dt><dd className={`text-3xl font-semibold tabular-nums ${label === "Won" || label === "Win rate" ? "text-accent" : "text-ink"}`}>{value}</dd></div>)}
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted">Sample completed matches only. Filters apply to statistics, activity, and history.</p>
        </div>
      </section>

      <section aria-labelledby="profileActivityTitle">
        <div className="mb-4 flex items-center gap-3"><h3 id="profileActivityTitle" className="text-xl font-semibold tracking-tight">Activity</h3><span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold tracking-wider text-muted">ALL TIME</span></div>
        <dl className="grid grid-cols-3 divide-x divide-line rounded-3xl border border-line bg-tint/30 py-5">
          {([["Sessions", sessions, "calendar"], ["Play time", playTime, "clock"], ["Opponents", opponents, "people"]] as const).map(([label, value, icon]) => <div key={label} className="flex min-w-0 flex-col items-center px-1 text-center"><DashboardIcon name={icon} className="mb-3 h-5 w-5 text-accent" /><dt className="order-2 mt-2 text-xs text-muted">{label}</dt><dd className="text-xl font-semibold tabular-nums sm:text-2xl">{value}</dd></div>)}
        </dl>
        <p className="mt-3 text-sm leading-6 text-muted">You’ve played {playTime} across {sessions} {sessions === 1 ? "session" : "sessions"} and faced {opponents} {opponents === 1 ? "opponent" : "opponents"}.</p>
      </section>

      <section aria-labelledby="profileHistoryTitle">
        <h3 id="profileHistoryTitle" className="mb-4 text-xl font-semibold tracking-tight">Player history</h3>
        {history.length ? <ul className="divide-y divide-line rounded-3xl border border-line px-4 sm:px-5">{history.map((match) => <li key={match.id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="text-sm font-semibold">{match.sessionTitle}</p><p className="mt-1 text-xs leading-5 text-muted"><time dateTime={match.playedAt}>{new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Manila" }).format(new Date(match.playedAt))}</time><span className="capitalize"> · {match.type}</span> · {match.durationMinutes}m</p><span className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-semibold ${match.result === "win" ? "bg-tint text-accent" : "bg-canvas text-muted"}`}>{match.result === "win" ? "Won" : "Lost"}</span></div><p aria-label={`Score ${match.score[0]} to ${match.score[1]}`} className="shrink-0 text-xl font-semibold tabular-nums">{match.score[0]}<span className="mx-1 text-muted">–</span>{match.score[1]}</p></li>)}</ul> : <p className="rounded-2xl border border-line p-5 text-sm text-muted">No completed matches yet.</p>}
      </section>
    </div>
  );
}
