import type { PlayerPreferences, PlayerStatus, QueueInfo, SessionSummary } from "../../types/dashboard";

import { matchPreferenceLabels, opponentLabels } from "../../lib/dashboardLabels";
const statusCopy: Record<PlayerStatus, string> = {
  waiting: "You're in the queue. Keep an eye on your next match.",
  ready: "You're ready. Head to your assigned court when it's available.",
  playing: "Enjoy your game. Your court and lineup are below.",
  resting: "Take your time. Rejoin the queue when you're ready.",
};

type Props = {
  session: SessionSummary;
  status: PlayerStatus;
  queue: QueueInfo;
  preferences: PlayerPreferences;
  onStatusChange: (status: PlayerStatus) => void;
  onPreferences: () => void;
};

export default function LiveSessionCard({ session, status, queue, preferences, onStatusChange, onPreferences }: Props) {
  return (
    <section id="sessions" className="panel scroll-mt-6 overflow-hidden" aria-labelledby="liveTitle">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <h2 id="liveTitle" className="font-semibold">{session.title}</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-tint px-2.5 py-1 text-[10px] font-bold tracking-wider text-accent-dark"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />LIVE</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs text-muted">Your status</p>
        <p role="status" className="mt-1 text-2xl font-semibold tracking-tight text-accent-dark">{status.toUpperCase()}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{statusCopy[status]}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-line py-5 text-sm">
          <div><dt className="text-xs text-muted">Queue position</dt><dd className="mt-1.5 font-semibold">{status === "waiting" ? `#${queue.position}` : status === "resting" ? "Not in queue" : "Match assigned"}</dd></div>
          <div><dt className="text-xs text-muted">Players ahead</dt><dd className="mt-1.5 font-semibold">{status === "waiting" ? queue.playersAhead : "—"}</dd></div>
          <div><dt className="text-xs text-muted">Games played</dt><dd className="mt-1.5 font-semibold">{queue.gamesPlayed}</dd></div>
          <div><dt className="text-xs text-muted">Match type</dt><dd className="mt-1.5 font-semibold">{matchPreferenceLabels[preferences.matchType]}</dd></div>
          <div className="col-span-2"><dt className="text-xs text-muted">Opponent preference</dt><dd className="mt-1.5 font-semibold">{opponentLabels[preferences.opponent]}</dd></div>
        </dl>
        <div className="mt-5 flex flex-col gap-3">
          {status === "waiting" && <button className="button-primary w-full" onClick={() => onStatusChange("ready")}>I'm Ready</button>}
          {status === "resting" && <button className="button-primary w-full" onClick={() => onStatusChange("waiting")}>Rejoin Queue</button>}
          {(status === "waiting" || status === "ready") && <button className="button-secondary w-full" onClick={() => onStatusChange("resting")}>Take a Rest</button>}
          <button className="text-link min-h-11 cursor-pointer text-sm" onClick={onPreferences}>Change Preference</button>
        </div>
      </div>
    </section>
  );
}
