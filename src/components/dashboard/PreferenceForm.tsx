import { useState, type FormEvent } from "react";
import type { MatchTypePreference, PlayerPreferences, SessionMatchTypes } from "../../types/dashboard";
import { matchPreferenceLabels, opponentLabels } from "../../lib/dashboardLabels";

type Props = { preferences: PlayerPreferences; sessionMatchTypes: SessionMatchTypes; onSave: (preferences: PlayerPreferences) => void };

export default function PreferenceForm({ preferences, sessionMatchTypes, onSave }: Props) {
  const [opponent, setOpponent] = useState(preferences.opponent);
  const [matchType, setMatchType] = useState(preferences.matchType);
  const allowedTypes: MatchTypePreference[] = sessionMatchTypes === "both" ? ["singles", "doubles", "either"] : [sessionMatchTypes];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ opponent, matchType: allowedTypes.includes(matchType) ? matchType : allowedTypes[0] });
  };
  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-sm leading-6 text-muted">Preferences apply to this session. Your player skill level stays the same.</p>
      <div>
        <label htmlFor="opponentPreference" className="form-label">Opponent preference</label>
        <select id="opponentPreference" value={opponent} onChange={(event) => setOpponent(event.target.value as PlayerPreferences["opponent"])} className="form-input">
          {Object.entries(opponentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="matchTypePreference" className="form-label">Match type preference</label>
        <select id="matchTypePreference" value={allowedTypes.includes(matchType) ? matchType : allowedTypes[0]} onChange={(event) => setMatchType(event.target.value as PlayerPreferences["matchType"])} className="form-input">
          {allowedTypes.map((value) => <option key={value} value={value}>{matchPreferenceLabels[value]}</option>)}
        </select>
      </div>
      <button className="button-primary w-full" type="submit">Save preferences</button>
    </form>
  );
}
