import type { DashboardPlayer } from "../../types/dashboard";
import DashboardIcon from "./DashboardIcon";

export default function DashboardHeader({ player }: { player: DashboardPlayer }) {
  const initials = player.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="dashboard-intro">
      <div className="dashboard-intro-content">
        <p className="dashboard-intro-kicker"><span className="dashboard-live-dot" /> PREVIEW · SAMPLE DATA</p>
        <h1>Play more.<br /><span>Wait less.</span></h1>
        <p className="dashboard-intro-copy">Welcome back, {player.name.split(" ")[0]}. Your next game starts here.</p>
      </div>
      <div className="dashboard-intro-art" aria-hidden="true">
        <div className="dashboard-intro-orbit"><DashboardIcon name="court" className="h-18 w-18" /></div>
        <span className="dashboard-intro-player">{initials}</span>
      </div>
    </header>
  );
}
