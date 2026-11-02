import type { DashboardPlayer, RecentMatch } from "../../types/dashboard";
import DashboardIcon from "./DashboardIcon";

export default function PlayerCard({ player, matches, onProfile }: { player: DashboardPlayer; matches: RecentMatch[]; onProfile: () => void }) {
  const initials = player.name.split(" ").map((name) => name[0]).slice(0, 2).join("");
  return (
    <section aria-labelledby="playerCardTitle">
      <h2 id="playerCardTitle" className="dashboard-section-title">Your player card</h2>
      <div className="panel p-5 sm:p-7">
        <div className="flex items-center gap-4 sm:gap-5">
          <span aria-hidden="true" className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-4 border-paper bg-accent text-xl font-semibold text-on-accent ring-1 ring-accent/30 sm:h-20 sm:w-20">{initials}</span>
          <div className="min-w-0"><h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{player.name}</h3><p className="mt-2 inline-flex rounded-full bg-elevated px-3 py-1 text-xs font-semibold text-ink">{player.skillLevel || "Skill level not set"}</p></div>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-5">
          <dl className="flex flex-wrap gap-7 sm:gap-10">
            <div><dt className="text-sm text-muted">Recent matches</dt><dd className="mt-2 flex items-center gap-2 text-2xl font-semibold tabular-nums"><DashboardIcon name="court" className="h-4 w-4 text-muted" />{matches.length}</dd></div>
            <div><dt className="text-sm text-muted">Recent wins</dt><dd className="mt-2 flex items-center gap-2 text-2xl font-semibold tabular-nums"><DashboardIcon name="trophy" className="h-4 w-4 text-muted" />{matches.filter((match) => match.result === "win").length}</dd></div>
          </dl>
          <button className="button-secondary gap-2 rounded-full" onClick={onProfile}>View profile <DashboardIcon name="chevron" className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}
