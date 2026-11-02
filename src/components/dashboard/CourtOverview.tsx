import type { Court } from "../../types/dashboard";

const courtLabels = { available: "Available", playing: "Playing", up_next: "Up Next" } as const;

export default function CourtOverview({ courts }: { courts: Court[] }) {
  return (
    <section aria-labelledby="courtsTitle">
      <h2 id="courtsTitle" className="mb-3 text-base font-semibold">Court Overview</h2>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {courts.map((court) => (
          <li key={court.id} className="panel rounded-2xl px-2 py-4 text-center sm:px-4">
            <span aria-hidden="true" className={`mx-auto mb-3 block h-1.5 w-1.5 rounded-full ${court.status === "available" ? "bg-success" : court.status === "playing" ? "bg-accent" : "bg-warning"}`} />
            <h3 className="text-sm font-semibold">{court.name}</h3>
            <p className="mt-1.5 text-xs text-muted sm:text-sm">{courtLabels[court.status]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
