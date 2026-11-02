# Player dashboard preview

Open `/dashboard`. All player, session, queue, court, and result data is sample
data from `src/data/dashboardMock.ts`. Nothing on this dashboard joins a real
session or writes preferences to Supabase. The existing auth-context sign-out
action remains available under Profile.

## Try the states

- Start with **No active session**: Get started shows a prominent red host card
  and a separate join card. Your player card follows, then Your game.
- Choose **Join a Session**, enter **DEMO01**, then choose **Join demo session**
  to enter the waiting preview. The QR and invite-link options explain that
  those join methods are not connected yet.
- Try **I'm Ready**, **Take a Rest**, and **Rejoin Queue**. Resting removes the
  assigned-match card. Queue counts only appear while waiting; no wait-time
  estimates are shown. Developer state and match-type selectors have been removed.
- **Change Preference** edits only the session's opponent and match type
  preferences. The sample player's skill remains Intermediate. A session
  supporting both match types offers Singles, Doubles, and Either; a restricted
  session only offers its supported type.
- **View all**, the upcoming card, **Profile**, and **Host a Session** open
  preview dialogs. Host creation and profile editing are future work.
- **View profile** navigates to the dedicated `/profile` page with played, won, lost,
  and win-rate statistics; Activity shows distinct completed sessions, total
  match duration, and distinct opponents. All matches / Singles / Doubles
  filters update the statistics, activity, and dated history together. No XP
  or progression levels are shown. Values are derived from sample match records;
  an empty history shows zero activity and an unavailable win rate. The page
  has Back in the upper left and Edit in the upper right. Edit currently shows
  a future-update message, and Sign out is not shown on the profile page.
- Navigation uses in-page Home, Sessions, and Matches anchors, plus the Profile
  dialog. It appears in the desktop header and becomes a fixed bottom bar on
  smaller screens. Home remains highlighted.

All preview state resets on reload. Court states and recent scores are display
fixtures, not calculations or matchmaking results. No host management controls,
database migrations, Realtime subscriptions, scoring logic, or new API calls
were added. Authentication and registration files were not modified.

## Structure

- `src/pages/dashboard.tsx`: preview state, action wiring, and layout.
- `src/components/dashboard/`: player header, join/upcoming cards, live-session
  card, match/result cards, court overview, navigation, dialogs, and forms.
- `src/types/dashboard.ts`: player, session, queue, preferences, matches, courts,
  and result types. Singles and doubles use different team tuple lengths.
- `src/lib/dashboardLabels.ts`: shared display labels.
- `src/data/dashboardMock.ts`: replaceable fixtures.
- `tests/dashboard.test.tsx`: interaction tests using a mocked auth hook.

All pages share the warm red accent, cream surfaces, typography, borders, and
selection colors defined in `src/index.css`. The dashboard uses a large welcome
heading, rounded action cards, a player summary, and a grouped game section.
Cards stack on mobile; game details use two columns on wider screens. The player
card shows the sample player's skill and recent match/win counts from fixtures.
History opens through Recent Matches; profile navigation uses the dedicated
`/profile` route from the player card, navigation, or Settings. The redundant
Manage section is removed. No clubs, ranking system,
premium analytics, badges, or offline sync features were added. Keyboard focus
and reduced-motion preferences are supported. Authentication and registration
were not redesigned.

## Future data requirements

An eventual dashboard data layer will need:

1. Player identity, display name, avatar, and persistent skill level.
2. Session metadata, start time, supported match types, capacity, membership,
   and live status for the current player.
3. Player session status, opponent preference, and match type preference.
4. Authoritative queue position, players ahead, and completed games count.
5. Current/next match assignment, teams, match type, court, and readiness.
6. Read-only court states and recent completed match results.
7. Authorized actions for joining, readiness/resting/rejoining, and updating
   session preferences. Host permissions belong in future host management.

These are data requirements, not proposed database table or endpoint names.
The server must eventually validate actions and supply authoritative state;
local session actions provide no permissions or real matchmaking behavior.

## Validation

Run `npm test`, `npm run lint`, and `npm run build`. Interaction tests cover demo
joining, resting/rejoining, ready/playing actions, singles lineups, skill-safe
preference updates, restricted match types, and profile/history dialogs.
