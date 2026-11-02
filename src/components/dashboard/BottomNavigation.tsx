import { Link } from "react-router-dom";

const icons = {
  home: "m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9",
  sessions: "M5 5h14v16H5zM8 3v4m8-4v4M5 10h14m-10 4h2m2 0h2m-6 3h2",
  matches: "M8 3h8v5a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v6m-4 3h8m-8 0v-3h8v3",
  profile: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
};

export default function BottomNavigation() {
  const itemClass = "flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <nav aria-label="Main navigation" className="dashboard-navigation fixed inset-x-0 bottom-0 z-20 mx-auto border-t border-line bg-paper px-3 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {([ ["Home", "home"], ["Sessions", "sessions"], ["Matches", "matches"] ] as const).map(([label, key]) => (
          <a key={key} href={key === "home" ? "#home" : key === "sessions" ? "#session-section" : "#matches-section"} aria-current={key === "home" ? "page" : undefined} className={`${itemClass} ${key === "home" ? "bg-selected text-ink" : "text-muted hover:bg-elevated hover:text-ink"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d={icons[key]} /></svg>
            {label}
          </a>
        ))}
        <Link to="/profile" className={`${itemClass} cursor-pointer text-muted hover:text-accent`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d={icons.profile} /></svg>
          Profile
        </Link>
      </div>
    </nav>
  );
}

