import { mockPlayer, mockRecentMatches } from "../data/dashboardMock";
import type { DashboardPlayer, RecentMatch } from "../types/dashboard";

export const PROFILE_STORAGE_KEY = "yorkel.profile-data";
export const DEVICE_STORAGE_KEY = "yorkel.device-id";

export type ProfileData = {
  player: DashboardPlayer;
  matches: RecentMatch[];
};

export type ProfileBackup = {
  app: "YorKel";
  version: 1;
  exportedAt: string;
  profile: ProfileData;
};

function isProfileData(value: unknown): value is ProfileData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ProfileData>;
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Pro", null];
  const matches = candidate.matches;
  return Boolean(
    candidate.player &&
    typeof candidate.player.id === "string" &&
    typeof candidate.player.name === "string" &&
    skillLevels.includes(candidate.player.skillLevel) &&
    candidate.player.name.length <= 100 &&
    Array.isArray(matches) &&
    matches.length <= 10_000 &&
    matches.every((match) =>
      match && typeof match.id === "string" &&
      (match.result === "win" || match.result === "loss") &&
      (match.type === "singles" || match.type === "doubles") &&
      Array.isArray(match.score) && match.score.length === 2 && match.score.every(Number.isFinite) &&
      typeof match.sessionTitle === "string" &&
      typeof match.sessionId === "string" &&
      typeof match.playedAt === "string" &&
      Number.isFinite(match.durationMinutes) && match.durationMinutes >= 0 &&
      Array.isArray(match.opponentIds) && match.opponentIds.every((id) => typeof id === "string"),
    ),
  );
}

export function defaultProfileData(): ProfileData {
  return { player: { ...mockPlayer }, matches: mockRecentMatches.map((match) => ({ ...match, opponentIds: [...match.opponentIds] })) };
}

export function loadProfileData(): ProfileData {
  try {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) return defaultProfileData();
    const parsed: unknown = JSON.parse(stored);
    return isProfileData(parsed) ? parsed : defaultProfileData();
  } catch {
    return defaultProfileData();
  }
}

export function createProfileBackup(): ProfileBackup {
  return { app: "YorKel", version: 1, exportedAt: new Date().toISOString(), profile: loadProfileData() };
}

export function restoreProfileBackup(value: unknown): ProfileData {
  if (!value || typeof value !== "object") throw new Error("This is not a valid YorKel backup file.");
  const backup = value as Partial<ProfileBackup>;
  if (backup.app !== "YorKel" || backup.version !== 1 || !isProfileData(backup.profile)) {
    throw new Error("This is not a valid YorKel backup file.");
  }
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(backup.profile));
  return backup.profile;
}

export function createRecoveryCode() {
  const bytes = new TextEncoder().encode(JSON.stringify(createProfileBackup()));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function restoreProfileRecoveryCode(code: string) {
  const compact = code.replace(/\s/g, "");
  if (!compact || compact.length > 1_500_000 || !/^[A-Za-z0-9_-]+$/.test(compact)) {
    throw new Error("Enter a valid YorKel recovery code.");
  }
  try {
    const base64 = compact.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(compact.length / 4) * 4, "=");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return restoreProfileBackup(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (error) {
    if (error instanceof Error && error.message === "This is not a valid YorKel backup file.") throw error;
    throw new Error("Enter a valid YorKel recovery code.", { cause: error });
  }
}

export function getOrCreateDeviceId() {
  const stored = window.localStorage.getItem(DEVICE_STORAGE_KEY);
  if (stored) return stored;
  const id = `device_${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`;
  window.localStorage.setItem(DEVICE_STORAGE_KEY, id);
  return id;
}

export function clearLocalUserData() {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith("yorkel."))
    .forEach((key) => window.localStorage.removeItem(key));
}
