import type { Court, DashboardPlayer, PlayerMatch, PlayerPreferences, QueueInfo, RecentMatch, SessionSummary } from "../types/dashboard";

// Preview fixtures only. No Supabase reads or writes are made by this dashboard.
export const mockPlayer: DashboardPlayer = { id: "demo-alex", name: "Alex Santos", skillLevel: "Intermediate" };
export const mockSession: SessionSummary = {
  id: "demo-night",
  title: "Badminton Night",
  startsAt: "2026-10-30T19:00:00+08:00",
  playerCount: 14,
  capacity: 20,
  membership: "joined",
  matchTypes: "both",
};
export const mockQueue: QueueInfo = { position: 3, playersAhead: 4, gamesPlayed: 2 };
export const mockPreferences: PlayerPreferences = { opponent: "higher", matchType: "doubles" };
export const mockDoublesMatch: PlayerMatch = {
  id: "demo-doubles", type: "doubles", court: "Court 2",
  team: ["Alex", "Ben"], opponents: ["Carlo", "David"],
};
export const mockSinglesMatch: PlayerMatch = {
  id: "demo-singles", type: "singles", court: "Court 2",
  team: ["Alex"], opponents: ["Ben"],
};
export const mockCourts: Court[] = [
  { id: "court-1", name: "Court 1", status: "playing" },
  { id: "court-2", name: "Court 2", status: "up_next" },
  { id: "court-3", name: "Court 3", status: "available" },
];
export const mockRecentMatches: RecentMatch[] = [
  { id: "result-1", result: "win", score: [21, 17], type: "doubles", sessionTitle: "Tuesday Social", sessionId: "demo-tuesday", playedAt: "2026-10-20T20:00:00+08:00", durationMinutes: 24, opponentIds: ["carlo", "david"] },
  { id: "result-2", result: "loss", score: [18, 21], type: "singles", sessionTitle: "Tuesday Social", sessionId: "demo-tuesday", playedAt: "2026-10-20T19:00:00+08:00", durationMinutes: 22, opponentIds: ["ben"] },
  { id: "result-3", result: "win", score: [21, 15], type: "doubles", sessionTitle: "Weekend Games", sessionId: "demo-weekend", playedAt: "2026-10-18T16:00:00+08:00", durationMinutes: 20, opponentIds: ["carlo", "marco"] },
  { id: "result-4", result: "win", score: [21, 19], type: "singles", sessionTitle: "Weekend Games", sessionId: "demo-weekend", playedAt: "2026-10-18T15:00:00+08:00", durationMinutes: 26, opponentIds: ["david"] },
];
