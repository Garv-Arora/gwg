import { formatINR } from "@/lib/format";

type Props = {
  value: number;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  tone?: "default" | "credit" | "debit" | "neutral" | "gold";
  compact?: boolean;
  showSign?: boolean;
  className?: string;
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-sm font-semibold tracking-tight",
  md: "text-lg font-semibold tracking-tight",
  lg: "text-2xl font-display font-bold tracking-tight",
  xl: "text-4xl font-display font-bold tracking-tight",
  hero: "text-5xl sm:text-6xl font-display font-bold tracking-tight",
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-ink-primary",
  credit: "text-mint",
  debit: "text-danger",
  neutral: "text-ink-secondary",
  gold: "text-gold",
};

export function MoneyText({
  value,
  size = "lg",
  tone = "default",
  compact,
  showSign,
  className = "",
}: Props) {
  const abs = Math.abs(value);
  const sign = showSign ? (value > 0 ? "+ " : value < 0 ? "− " : "") : "";
  return (
    <span className={`${SIZE[size]} ${TONE[tone]} tabular-nums ${className}`}>
      {sign}
      {formatINR(abs, { compact })}
    </span>
  );
}
