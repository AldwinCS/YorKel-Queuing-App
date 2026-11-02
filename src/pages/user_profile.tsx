import { useState } from "react";
import DashboardIcon from "../components/dashboard/DashboardIcon";
import SubpageHeader from "../components/SubpageHeader";
import PlayerProfile from "../components/dashboard/PlayerProfile";
import { loadProfileData } from "../lib/profileStorage";

export default function UserProfile() {
  const [notice, setNotice] = useState("");
  const [profile] = useState(loadProfileData);

  return (
    <main className="dashboard min-h-svh bg-canvas text-ink">
      <SubpageHeader
        title="Player profile"
        backTo="/dashboard"
        backLabel="dashboard"
        action={
          <button
            type="button"
            aria-label="Edit profile"
            onClick={() =>
              setNotice("Profile editing will be available in a future update.")
            }
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-semibold text-accent transition-colors hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <DashboardIcon name="edit" className="h-5 w-5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        }
      />

      <div className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8 sm:py-10">
        {notice && (
          <p
            role="status"
            className="mb-6 rounded-xl border border-line bg-paper p-4 text-sm leading-6 text-accent-dark"
          >
            {notice}
          </p>
        )}
        <PlayerProfile player={profile.player} matches={profile.matches} />
      </div>
    </main>
  );
}
