import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "../components/dashboard/DashboardIcon";
import SubpageHeader from "../components/SubpageHeader";
import { useAppearance } from "../hooks/useAppearance";
import { useAuth } from "../hooks/useAuth";
import {
  clearLocalUserData,
  getOrCreateDeviceId,
  loadProfileData,
} from "../lib/profileStorage";
import type { Appearance } from "../context/AppearanceContext";

const appearanceOptions: Array<{ value: Appearance; label: string; description: string; icon: "sun" | "moon" | "system" }> = [
  { value: "light", label: "Light", description: "Always use the light theme", icon: "sun" },
  { value: "dark", label: "Dark", description: "Always use the dark theme", icon: "moon" },
  { value: "system", label: "System", description: "Follow this device", icon: "system" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { appearance, resolvedAppearance, setAppearance } = useAppearance();
  const [profile] = useState(loadProfileData);
  const [deviceId] = useState(getOrCreateDeviceId);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const playerId = session?.user.id ?? profile.player.id;
  const initials = profile.player.name.split(" ").map((part) => part[0]).slice(0, 2).join("");

  const announce = (message: string) => {
    setError("");
    setNotice(message);
  };

  const copyIdentity = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      announce(`${label} copied.`);
    } catch {
      setNotice("");
      setError(`Could not copy the ${label.toLowerCase()}. Select it and copy it manually.`);
    }
  };

  const deleteUserData = async () => {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    clearLocalUserData();
    setAppearance("system");
    const result = await signOut();
    if (result.success) {
      navigate("/login", { replace: true });
      return;
    }
    setDeleting(false);
    setError("Local data was deleted, but sign out failed. Please try signing out again.");
  };

  return (
    <main className="dashboard min-h-svh bg-canvas pb-12 text-ink">
      <SubpageHeader title="Settings" backTo="/dashboard" backLabel="dashboard" />

      <div className="mx-auto w-full max-w-3xl space-y-9 px-5 py-7 sm:px-8 sm:py-10">
        <div className="subpage-banner">
          <span className="subpage-banner-label">YOUR SPACE / 02</span>
          <p>Make it<br /><strong>yours.</strong></p>
        </div>
        {(notice || error) && <p role={error ? "alert" : "status"} className={`rounded-xl border p-4 text-sm leading-6 ${error ? "border-danger/40 bg-danger-tint text-danger-dark" : "border-line bg-paper text-ink"}`}>{error || notice}</p>}

        <Link to="/profile" className="group relative flex min-h-36 items-center gap-5 overflow-hidden rounded-3xl border border-accent/20 bg-tint p-5 transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-7">
          <span aria-hidden="true" className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-4 border-paper bg-accent text-xl font-semibold text-on-accent ring-1 ring-accent/30">{initials}</span>
          <span className="relative z-10 min-w-0 flex-1"><span className="block text-xl font-semibold tracking-tight sm:text-2xl">{profile.player.name}</span><span className="mt-2 block text-sm leading-6 text-muted">View and edit your player profile</span></span>
          <DashboardIcon name="trophy" className="pointer-events-none absolute -right-5 -bottom-8 h-40 w-40 -rotate-12 text-accent/10" />
          <DashboardIcon name="chevron" className="relative h-6 w-6 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
        </Link>

        <section aria-labelledby="identityTitle">
          <h2 id="identityTitle" className="dashboard-section-title">Your identity</h2>
          <p className="-mt-2 mb-5 max-w-xl text-sm leading-6 text-muted">These identify your profile and this browser. Share them only with support.</p>
          <dl className="panel divide-y divide-line overflow-hidden">
            {([["Player ID", playerId, "profile"], ["Device ID", deviceId, "device"]] as const).map(([label, value, icon]) => <div key={label} className="p-5 sm:p-6"><dt className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-muted uppercase"><DashboardIcon name={icon} className="h-4 w-4" />{label}</dt><dd className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center"><code className="min-w-0 flex-1 overflow-wrap-anywhere text-sm leading-6 text-ink sm:text-base">{value}</code><button type="button" onClick={() => void copyIdentity(label, value)} className="button-secondary gap-2 rounded-full"><DashboardIcon name="copy" className="h-4 w-4" />Copy</button></dd></div>)}
          </dl>
        </section>

        <section aria-labelledby="appearanceTitle">
          <h2 id="appearanceTitle" className="dashboard-section-title">Appearance</h2>
          <p className="-mt-2 mb-5 text-sm leading-6 text-muted">Choose a theme or follow your device. System is currently using {resolvedAppearance} mode.</p>
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Appearance">
            {appearanceOptions.map((option) => <button key={option.value} type="button" role="radio" aria-checked={appearance === option.value} onClick={() => setAppearance(option.value)} className={`flex min-h-24 cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${appearance === option.value ? "border-accent bg-tint text-accent" : "border-line bg-paper text-muted hover:border-accent/40"}`}><DashboardIcon name={option.icon} className="h-6 w-6 shrink-0" /><span><span className="block font-semibold">{option.label}</span><span className="mt-1 block text-xs leading-5">{option.description}</span></span></button>)}
          </div>
        </section>

        <section aria-labelledby="backupTitle">
          <h2 id="backupTitle" className="dashboard-section-title">Backup and restore</h2>
          <p className="-mt-2 mb-5 text-sm leading-6 text-muted">Create a recovery code or restore a profile saved from another device.</p>
          <Link to="/settings/backup" className="settings-row panel"><span className="dashboard-action-icon bg-tint text-accent"><DashboardIcon name="shield" /></span><span className="min-w-0 flex-1"><span className="block font-semibold">Back up / restore profile</span><span className="mt-1 block text-sm leading-5 text-muted">Recovery code, saved backup file, or pasted code.</span></span><DashboardIcon name="chevron" className="h-5 w-5 text-muted" /></Link>
        </section>

        <section aria-labelledby="deleteTitle" className="rounded-3xl border border-danger/30 bg-paper p-5 sm:p-6">
          <h2 id="deleteTitle" className="text-xl font-semibold tracking-tight text-danger-dark">Delete all user data</h2>
          <p className="mt-2 text-sm leading-6 text-muted">This removes YorKel profile data stored in this browser and signs you out. Cloud account deletion is not connected in this preview.</p>
          {!confirmDelete ? <button type="button" onClick={() => { setConfirmDelete(true); setNotice(""); setError(""); }} className="mt-5 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-danger px-5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-danger"><DashboardIcon name="trash" className="h-5 w-5" />Delete all user data</button> : <div className="mt-5 border-t border-line pt-5"><label htmlFor="deleteConfirmation" className="form-label">Type DELETE to confirm</label><input id="deleteConfirmation" value={deleteText} onChange={(event) => setDeleteText(event.target.value)} autoComplete="off" className="form-input" /><div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={deleteText !== "DELETE" || deleting} onClick={() => void deleteUserData()} className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-danger px-5 py-3 text-sm font-semibold text-on-danger transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-danger disabled:cursor-not-allowed disabled:opacity-60">{deleting ? "Deleting…" : "Permanently delete local data"}</button><button type="button" disabled={deleting} onClick={() => { setConfirmDelete(false); setDeleteText(""); }} className="button-secondary">Cancel</button></div></div>}
        </section>
      </div>
    </main>
  );
}
