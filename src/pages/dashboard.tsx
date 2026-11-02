import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import {
  JoinSessionCard,
  UpcomingSession,
} from "../components/dashboard/SessionCards";
import LiveSessionCard from "../components/dashboard/LiveSessionCard";
import {
  NextMatchCard,
  RecentMatches,
} from "../components/dashboard/MatchCards";
import CourtOverview from "../components/dashboard/CourtOverview";
import BottomNavigation from "../components/dashboard/BottomNavigation";
import DashboardDialog from "../components/dashboard/DashboardDialog";
import PreferenceForm from "../components/dashboard/PreferenceForm";
import JoinSessionForm from "../components/dashboard/JoinSessionForm";
import DashboardIcon from "../components/dashboard/DashboardIcon";
import PlayerCard from "../components/dashboard/PlayerCard";
import {
  mockCourts,
  mockDoublesMatch,
  mockPlayer,
  mockPreferences,
  mockQueue,
  mockRecentMatches,
  mockSession,
} from "../data/dashboardMock";
import type {
  Court,
  PlayerPreferences,
  PlayerStatus,
} from "../types/dashboard";

type Dialog =
  | "join"
  | "host"
  | "preferences"
  | "session"
  | "history"
  | "notifications";

const dialogTitles: Record<Dialog, string> = {
  join: "Join a Session",
  host: "Host a Session",
  preferences: "Session Preferences",
  session: "Upcoming Session",
  history: "Match History",
  notifications: "Notifications",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus | null>(null);
  const [preferences, setPreferences] = useState<PlayerPreferences>({
    ...mockPreferences,
  });
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [notice, setNotice] = useState("");
  const match = mockDoublesMatch;

  const courts: Court[] = mockCourts.map((court) =>
    court.id === "court-2"
      ? {
          ...court,
          status:
            playerStatus === "playing"
              ? "playing"
              : playerStatus === "resting"
                ? "available"
                : "up_next",
        }
      : court,
  );

  const changeStatus = (status: PlayerStatus) => {
    setPlayerStatus(status);
    setNotice(
      status === "waiting"
        ? "You rejoined the queue."
        : `Your status is now ${status}.`,
    );
  };

  return (
    <main
      id="home"
      className="dashboard min-h-svh bg-canvas pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-ink lg:pb-14"
    >
      <header className="dashboard-topbar sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-17 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/dashboard"
            aria-label="YorKel dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-on-accent">
              <DashboardIcon name="court" className="h-5 w-5" />
            </span>
            <span className="text-lg font-black tracking-[-0.05em] text-ink">YOR<span className="text-accent">KEL</span></span>
          </Link>

          <nav aria-label="Desktop navigation" className="hidden items-center gap-1 lg:flex">
            <a href="#home" aria-current="page" className="dashboard-desktop-link dashboard-desktop-link-active">Overview</a>
            <a href="#session-section" className="dashboard-desktop-link">Sessions</a>
            <a href="#matches-section" className="dashboard-desktop-link">Matches</a>
            <Link to="/profile" className="dashboard-desktop-link">Player profile</Link>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Notifications"
              aria-haspopup="dialog"
              onClick={() => setDialog("notifications")}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-elevated hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <DashboardIcon name="bell" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Settings"
              onClick={() => navigate("/settings")}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-elevated hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <DashboardIcon name="settings" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <DashboardHeader player={mockPlayer} />

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink"
          >
            {notice}
          </div>
        )}

        <div className="dashboard-content-grid mt-7">
          <div className="space-y-7">
          <div id="session-section" className="scroll-mt-24">
            {playerStatus ? (
                <LiveSessionCard
                  session={mockSession}
                  status={playerStatus}
                  queue={mockQueue}
                  preferences={preferences}
                  onStatusChange={changeStatus}
                  onPreferences={() => setDialog("preferences")}
                />
            ) : (
              <JoinSessionCard
                onJoin={() => setDialog("join")}
                onHost={() => setDialog("host")}
              />
            )}
          </div>

          {playerStatus && playerStatus !== "resting" && (
            <div>
              <NextMatchCard
                match={match}
                status={playerStatus}
                onReady={() => changeStatus("ready")}
              />
            </div>
          )}

          <div>
            {playerStatus ? (
              <CourtOverview courts={courts} />
            ) : (
              <UpcomingSession
                session={mockSession}
                onView={() => setDialog("session")}
              />
            )}
          </div>

          </div>

          <div className="space-y-7">
          <div>
            <PlayerCard
              player={mockPlayer}
              matches={mockRecentMatches}
              onProfile={() => navigate("/profile")}
            />
          </div>

          <div id="matches-section" className="scroll-mt-24">
            <RecentMatches matches={mockRecentMatches.slice(0, 2)} onViewAll={() => setDialog("history")} />
          </div>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {dialog && (
        <DashboardDialog
          key={dialog}
          title={dialogTitles[dialog]}
          onClose={() => setDialog(null)}
        >
          {dialog === "notifications" && (
            <div className="py-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-elevated text-ink">
                <DashboardIcon name="bell" className="h-6 w-6" />
              </span>
              <h3 className="font-semibold">No notifications yet</h3>
              <p className="mt-2 text-sm text-muted">
                Notifications aren't connected in this preview.
              </p>
            </div>
          )}

          {dialog === "join" && (
            <JoinSessionForm
              onJoin={() => {
                setPlayerStatus("waiting");
                setDialog(null);
                setNotice("You joined the demo session.");
              }}
            />
          )}

          {dialog === "host" && (
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>Host session creation is coming soon.</p>
              <p>
                You'll be able to create a session, choose courts, and
                configure match types from the same app.
              </p>
            </div>
          )}

          {dialog === "preferences" && (
            <PreferenceForm
              preferences={preferences}
              sessionMatchTypes={mockSession.matchTypes}
              onSave={(values) => {
                setPreferences(values);
                setDialog(null);
                setNotice("Session preferences updated.");
              }}
            />
          )}

          {dialog === "session" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{mockSession.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  Friday, October 30 · 7:00 PM
                </p>
              </div>
              <div className="rounded-2xl bg-elevated p-4">
                <p className="font-medium">
                  {mockSession.playerCount} / {mockSession.capacity} players
                </p>
                <p className="mt-1 text-sm text-muted">
                  Singles &amp; Doubles
                </p>
              </div>
            </div>
          )}

          {dialog === "history" && (
            <RecentMatches matches={mockRecentMatches} />
          )}
        </DashboardDialog>
      )}
    </main>
  );
};

export default Dashboard;
