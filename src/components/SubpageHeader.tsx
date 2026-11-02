import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "./dashboard/DashboardIcon";

type SubpageHeaderProps = {
  title: string;
  backTo: string;
  backLabel: string;
  action?: ReactNode;
};

export default function SubpageHeader({ title, backTo, backLabel, action }: SubpageHeaderProps) {
  return (
    <header className="subpage-header border-b border-line bg-paper">
      <div className="mx-auto grid min-h-20 w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-4 sm:px-8">
        <Link
          to={backTo}
          aria-label={`Back to ${backLabel}`}
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-2 text-sm font-semibold text-ink transition-colors hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <DashboardIcon name="back" className="h-5 w-5" />
          <span>Back</span>
        </Link>
        <h1 className="text-center text-base font-semibold tracking-tight sm:text-xl">{title}</h1>
        <div className="flex justify-end">{action}</div>
      </div>
    </header>
  );
}
