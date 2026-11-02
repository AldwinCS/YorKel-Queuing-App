const paths = {
  shield: "M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Zm-2 9 2 2 4-5",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-10h.01",
  copy: "M8 8h11v11H8zM5 16H4V4h12v1",
  device: "M7 2h10v20H7zM10 18h4",
  download: "M12 3v12m-4-4 4 4 4-4M4 20h16",
  upload: "M12 16V4m-4 4 4-4 4 4M4 20h16",
  trash: "M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6",
  sun: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4",
  moon: "M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z",
  system: "M4 5h16v11H4zM8 20h8m-4-4v4",
  back: "m15 18-6-6 6-6M9 12h12",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  people: "M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 21v-3a5 5 0 0 1 10 0v3M16 4a3 3 0 0 1 0 6m0 3a5 5 0 0 1 5 5v3",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4M12 2V1",
  settings: "M9.5 3h5l.6 2.4 1.8 1 2.4-.7 2.5 4.3-1.8 1.7v2.1l1.8 1.7-2.5 4.3-2.4-.7-1.8 1-.6 2.4h-5l-.6-2.4-1.8-1-2.4.7-2.5-4.3L4 13.8v-2.1L2.2 10l2.5-4.3 2.4.7 1.8-1 .6-2.4ZM15.5 12.7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
  profile: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  arrow: "M7 17 17 7M7 7h10v10",
  plus: "M12 5v14M5 12h14",
  calendar: "M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z",
  court: "M3 4h18v16H3zM3 12h18M7 4v16M17 4v16M7 8h10M7 16h10",
  trophy: "M8 3h8v5a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v6m-4 3h8",
  chevron: "m9 5 7 7-7 7",
};

export default function DashboardIcon({ name, className = "h-5 w-5" }: { name: keyof typeof paths; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={paths[name]} /></svg>;
}
