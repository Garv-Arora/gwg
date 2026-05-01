import type { ReactNode } from "react";

type Props = {
  emoji?: string;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  emoji = "✨",
  title,
  body,
  action,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-card glass p-6 text-center flex flex-col items-center gap-3 ${className}`}
    >
      <div className="h-16 w-16 rounded-full grid place-items-center bg-soft/60 text-3xl">
        {emoji}
      </div>
      <div>
        <h3 className="font-display font-semibold text-ink-primary">{title}</h3>
        {body && (
          <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{body}</p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
