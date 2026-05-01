import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp" | "gold";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-mint text-bg hover:bg-mint-deep active:scale-[0.99] shadow-glow font-semibold",
  secondary:
    "bg-soft/70 text-ink-primary hover:bg-soft border border-white/[0.06]",
  ghost: "bg-transparent text-ink-secondary hover:text-ink-primary",
  danger: "bg-danger-soft text-danger hover:bg-danger/30 border border-danger/30",
  whatsapp:
    "bg-[#25D366] text-bg hover:bg-[#1FB957] active:scale-[0.99] shadow-glow font-semibold",
  gold: "bg-gold text-bg hover:bg-gold/90 active:scale-[0.99] font-semibold",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-6 text-base",
};

function classes({
  variant = "primary",
  size = "md",
  full,
  loading,
  className = "",
}: Omit<CommonProps, "children" | "icon">) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-pill no-tap-highlight transition",
    "disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    full ? "w-full" : "",
    loading ? "pointer-events-none" : "",
    className,
  ].join(" ");
}

export function Button({
  variant,
  size,
  full,
  loading,
  icon,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={classes({ variant, size, full, loading, className })}
      {...rest}
    >
      {loading ? (
        <Spinner />
      ) : icon ? (
        <span className="-ml-1">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export function LinkButton({
  href,
  variant,
  size,
  full,
  icon,
  className,
  children,
  external,
}: CommonProps & { href: string; external?: boolean }) {
  const cls = classes({ variant, size, full, className });
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {icon ? <span className="-ml-1">{icon}</span> : null}
        <span>{children}</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {icon ? <span className="-ml-1">{icon}</span> : null}
      <span>{children}</span>
    </Link>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
      aria-hidden
    />
  );
}
