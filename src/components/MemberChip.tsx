import { avatarColor, initials } from "@/lib/format";

type Size = "xs" | "sm" | "md" | "lg";

const SIZES: Record<Size, { box: string; text: string; ring: string }> = {
  xs: { box: "h-6 w-6", text: "text-[10px]", ring: "ring-1" },
  sm: { box: "h-8 w-8", text: "text-xs", ring: "ring-1" },
  md: { box: "h-10 w-10", text: "text-sm", ring: "ring-1" },
  lg: { box: "h-14 w-14", text: "text-lg", ring: "ring-2" },
};

export function Avatar({
  name,
  size = "md",
  ringClass = "ring-bg",
}: {
  name: string;
  size?: Size;
  ringClass?: string;
}) {
  const sz = SIZES[size];
  const color = avatarColor(name);
  return (
    <span
      className={`inline-grid place-items-center rounded-full font-semibold text-bg ${sz.box} ${sz.text} ${sz.ring} ${ringClass}`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

type ChipProps = {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "neutral" | "mint" | "gold";
  asButton?: boolean;
};

export function MemberChip({
  name,
  selected,
  onClick,
  trailing,
  size = "md",
  variant = "neutral",
  asButton,
}: ChipProps) {
  const isInteractive = !!onClick || asButton;
  const Comp = isInteractive ? "button" : "div";
  const variantBase =
    variant === "mint"
      ? "bg-mint-soft border-mint/40 text-mint"
      : variant === "gold"
        ? "bg-gold-soft border-gold/40 text-gold"
        : selected
          ? "bg-mint-soft border-mint/50 text-ink-primary"
          : "bg-soft/60 border-white/[0.06] text-ink-secondary hover:text-ink-primary";

  return (
    <Comp
      onClick={onClick}
      type={isInteractive ? "button" : undefined}
      className={`inline-flex items-center gap-2 rounded-pill border ${variantBase} ${
        size === "sm" ? "h-8 pl-1 pr-3" : "h-10 pl-1.5 pr-4"
      } no-tap-highlight transition`}
    >
      <Avatar name={name} size={size === "sm" ? "xs" : "sm"} />
      <span
        className={`${size === "sm" ? "text-xs" : "text-sm"} font-medium truncate max-w-[120px]`}
      >
        {name}
      </span>
      {trailing}
    </Comp>
  );
}
