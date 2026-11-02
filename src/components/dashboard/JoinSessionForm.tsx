import { useState, type FormEvent } from "react";

type JoinMethod = "code" | "qr" | "link";

export default function JoinSessionForm({ onJoin }: { onJoin: () => void }) {
  const [method, setMethod] = useState<JoinMethod>("code");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.trim().toUpperCase() !== "DEMO01") {
      setError("Use DEMO01 to try this preview.");
      return;
    }
    onJoin();
  };
  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-2" role="group" aria-label="Join method">
        {([ ["code", "Code"], ["qr", "QR Code"], ["link", "Invite Link"] ] as const).map(([value, label]) => (
          <button key={value} aria-pressed={method === value} onClick={() => { setMethod(value); setError(""); }} className={`button-secondary px-2 text-xs ${method === value ? "border-accent bg-tint" : ""}`}>{label}</button>
        ))}
      </div>
      {method === "code" ? (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm leading-6 text-muted">Try the sample session with code <strong className="text-ink">DEMO01</strong>. This only changes your preview.</p>
          <div><label htmlFor="sessionCode" className="form-label">Session code</label><input id="sessionCode" required maxLength={12} autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="DEMO01" value={code} onChange={(event) => setCode(event.target.value)} className="form-input uppercase tracking-widest" /></div>
          {error && <p role="alert" className="text-sm text-danger-dark">{error}</p>}
          <button type="submit" className="button-primary w-full">Join demo session</button>
        </form>
      ) : (
        <div className="rounded-xl bg-canvas p-5">
          <h3 className="font-semibold">{method === "qr" ? "Scan a host's QR code" : "Open your host's invite link"}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{method === "qr" ? "QR scanning will be available here in a future update." : "Invite links will open the host's session here in a future update."} For now, try the demo using a session code.</p>
          <button className="text-link mt-3 min-h-11 cursor-pointer text-sm" onClick={() => setMethod("code")}>Enter Session Code</button>
        </div>
      )}
    </div>
  );
}
