export type PlayerStatus = "waiting" | "ready" | "playing" | "resting";
export type MatchType = "singles" | "doubles";
export type SessionMatchTypes = MatchType | "both";
export type MatchTypePreference = MatchType | "either";
export type OpponentPreference = "same" | "higher" | "lower" | "any";
export type CourtStatus = "available" | "playing" | "up_next";

export type DashboardPlayer = {
  id: string;
  name: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Pro" | null;
};

export type PlayerPreferences = {
  opponent: OpponentPreference;
  matchType: MatchTypePreference;
};

export type SessionSummary = {
  id: string;
  title: string;
  startsAt: string;
  playerCount: number;
  capacity: number;
  membership: "joined" | "open";
  matchTypes: SessionMatchTypes;
};

export type QueueInfo = { position: number; playersAhead: number; gamesPlayed: number };
export type Court = { id: string; name: string; status: CourtStatus };

type MatchBase = { id: string; court: string };
export type PlayerMatch = MatchBase & (
  | { type: "singles"; team: [string]; opponents: [string] }
  | { type: "doubles"; team: [string, string]; opponents: [string, string] }
);

export type RecentMatch = {
  id: string;
  result: "win" | "loss";
  score: [number, number];
  type: MatchType;
  sessionTitle: string;
  sessionId: string;
  playedAt: string;
  durationMinutes: number;
  opponentIds: string[];
};
