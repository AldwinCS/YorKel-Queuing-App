import { useRef, useState, type ChangeEvent } from "react";
import DashboardIcon from "../components/dashboard/DashboardIcon";
import SubpageHeader from "../components/SubpageHeader";
import {
  createProfileBackup,
  createRecoveryCode,
  restoreProfileBackup,
  restoreProfileRecoveryCode,
} from "../lib/profileStorage";

export default function BackupRestore() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [pastedCode, setPastedCode] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const announce = (message: string) => { setError(""); setNotice(message); };
  const fail = (message: string) => { setNotice(""); setError(message); };

  const createCode = () => {
    setRecoveryCode(createRecoveryCode());
    announce("Recovery code created. Keep it somewhere private.");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      announce("Recovery code copied.");
    } catch {
      fail("Could not copy the code. Select it and copy it manually.");
    }
  };

  const downloadBackup = () => {
    const backup = createProfileBackup();
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `yorkel-profile-${backup.exportedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    announce("Profile backup downloaded.");
  };

  const restoreFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error("Choose a YorKel backup smaller than 1 MB.");
      const profile = restoreProfileBackup(JSON.parse(await file.text()));
      announce(`${profile.player.name}'s profile was restored.`);
    } catch (restoreError) {
      fail(restoreError instanceof Error ? restoreError.message : "The backup could not be restored.");
    }
  };

  const restoreCode = () => {
    try {
      const profile = restoreProfileRecoveryCode(pastedCode);
      setPastedCode("");
      setShowPaste(false);
      announce(`${profile.player.name}'s profile was restored.`);
    } catch (restoreError) {
      fail(restoreError instanceof Error ? restoreError.message : "The recovery code could not be restored.");
    }
  };

  return (
    <main className="dashboard min-h-svh bg-canvas pb-12 text-ink">
      <SubpageHeader title="Back up / restore" backTo="/settings" backLabel="settings" />

      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="subpage-banner mb-9">
          <span className="subpage-banner-label">PROFILE SECURITY / 03</span>
          <p>Save your<br /><strong>progress.</strong></p>
        </div>
        {(notice || error) && <p role={error ? "alert" : "status"} className={`mb-8 rounded-xl border p-4 text-sm leading-6 ${error ? "border-danger/40 bg-danger-tint text-danger-dark" : "border-line bg-paper"}`}>{error || notice}</p>}

        <section aria-labelledby="createBackupTitle" className="panel p-5 sm:p-7">
          <span aria-hidden="true" className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated text-ink"><DashboardIcon name="shield" className="h-8 w-8" /></span>
          <h2 id="createBackupTitle" className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Back up your profile</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">Your profile is stored on this browser. Create a private recovery code so you can restore it after changing devices or clearing browser data.</p>
          <button type="button" onClick={createCode} className="button-primary mt-7 w-full text-base">Create my recovery code</button>

          {recoveryCode && <div className="mt-6 rounded-2xl border border-line bg-elevated p-4"><label htmlFor="recoveryCode" className="form-label">Your recovery code</label><textarea id="recoveryCode" readOnly value={recoveryCode} rows={4} className="form-input h-auto resize-none py-3 font-mono text-sm leading-5" /><p className="mt-3 text-sm leading-5 text-muted">Anyone with this code can restore this local profile. Store it privately.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => void copyCode()} className="button-secondary gap-2"><DashboardIcon name="copy" className="h-4 w-4" />Copy code</button><button type="button" onClick={downloadBackup} className="button-secondary gap-2"><DashboardIcon name="download" className="h-4 w-4" />Download file</button></div></div>}
        </section>

        <div className="h-6 sm:h-8" />

        <section aria-labelledby="restoreTitle" className="panel p-5 sm:p-7">
          <h2 id="restoreTitle" className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Restore a profile</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">Choose a saved YorKel backup file or paste a recovery code from another device.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => fileInput.current?.click()} className="button-primary gap-2 text-base"><DashboardIcon name="upload" className="h-5 w-5" />Choose backup file</button>
            <button type="button" onClick={() => setShowPaste((shown) => !shown)} aria-expanded={showPaste} aria-controls="pasteRecoveryCode" className="button-secondary gap-2 text-base"><DashboardIcon name="copy" className="h-5 w-5" />Paste code</button>
            <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" aria-label="Choose profile backup" onChange={(event) => void restoreFile(event)} />
          </div>

          {showPaste && <div id="pasteRecoveryCode" className="mt-5 rounded-2xl border border-line bg-elevated p-4"><label htmlFor="pastedRecoveryCode" className="form-label">Recovery code</label><textarea id="pastedRecoveryCode" value={pastedCode} onChange={(event) => setPastedCode(event.target.value)} rows={5} autoComplete="off" spellCheck={false} className="form-input h-auto resize-y py-3 font-mono text-sm leading-5" placeholder="Paste your YorKel recovery code" /><button type="button" disabled={!pastedCode.trim()} onClick={restoreCode} className="button-primary mt-4 w-full">Restore this profile</button></div>}

          <p className="mt-7 flex items-start gap-3 text-sm leading-6 text-muted"><DashboardIcon name="info" className="mt-0.5 h-5 w-5 shrink-0" />Restoring replaces the YorKel profile stored in this browser. Create a recovery code for your current profile first if you may need it later.</p>
        </section>
      </div>
    </main>
  );
}
