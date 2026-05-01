import type { ReactNode, HTMLAttributes } from "react";

type Variant = "default" | "soft" | "outline" | "mint" | "gold";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  padded?: boolean;
  children: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  default: "bg-card shadow-card border border-white/[0.04]",
  soft: "bg-soft/40 border border-white/[0.04]",
  outline: "bg-transparent border border-white/10",
  mint: "bg-mint-soft border border-mint/30",
  gold: "bg-gold-soft border border-gold/30",
};

export function Card({
  variant = "default",
  padded = true,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div
      className={`rounded-card ${VARIANTS[variant]} ${padded ? "p-4" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h3 className="font-display font-semibold text-ink-primary text-base">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
