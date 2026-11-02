import { useEffect, useId, useRef, type ReactNode } from "react";

export default function DashboardDialog({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
      className={`panel m-auto max-h-[90svh] ${wide ? "w-170" : "w-110"} max-w-[calc(100%-2rem)] overflow-y-auto p-5 text-ink backdrop:bg-ink/40 sm:p-7`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-xl font-semibold tracking-tight">{title}</h2>
        <button aria-label="Close dialog" onClick={() => dialogRef.current?.close()} className="button-secondary h-11 w-11 shrink-0 px-0 text-xl">×</button>
      </div>
      {children}
    </dialog>
  );
}
