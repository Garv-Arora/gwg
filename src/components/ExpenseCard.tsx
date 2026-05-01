import Link from "next/link";
import { Avatar } from "./MemberChip";
import { MoneyText } from "./MoneyText";
import { formatRelative } from "@/lib/format";
import type { ExpenseWithSplits, TripMember } from "@/types";

type Props = {
  expense: ExpenseWithSplits;
  payer: TripMember | undefined;
  participants: TripMember[];
  href?: string;
  perspectiveMemberId?: string | null;
};

export function ExpenseCard({
  expense,
  payer,
  participants,
  href,
  perspectiveMemberId,
}: Props) {
  const yourSplit = perspectiveMemberId
    ? expense.splits.find((s) => s.member_id === perspectiveMemberId)
    : undefined;

  const youPaid = perspectiveMemberId === expense.payer_id;

  let perspectiveLine: React.ReactNode = null;
  if (perspectiveMemberId) {
    if (youPaid) {
      const owedBack = Number(expense.amount) - Number(yourSplit?.amount ?? 0);
      perspectiveLine = (
        <span className="text-mint">
          You lent <MoneyText value={owedBack} size="sm" tone="credit" />
        </span>
      );
    } else if (yourSplit) {
      perspectiveLine = (
        <span className="text-danger">
          You owe <MoneyText value={Number(yourSplit.amount)} size="sm" tone="debit" />
        </span>
      );
    } else {
      perspectiveLine = (
        <span className="text-ink-muted">Not in this split</span>
      );
    }
  }

  const inner = (
    <div className="flex items-start gap-3">
      <div className="h-12 w-12 rounded-2xl bg-soft/70 grid place-items-center text-xl shrink-0">
        {pickEmoji(expense.description)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-ink-primary font-medium truncate">
              {expense.description}
            </p>
            <p className="text-xs text-ink-muted mt-0.5 truncate">
              {payer?.display_name ?? "Someone"} paid · {participants.length}{" "}
              {participants.length === 1 ? "person" : "people"} ·{" "}
              {formatRelative(expense.created_at)}
            </p>
          </div>
          <MoneyText value={Number(expense.amount)} size="md" />
        </div>

        {perspectiveLine && (
          <div className="mt-2 text-xs">{perspectiveLine}</div>
        )}

        <div className="mt-3 flex items-center -space-x-2">
          {participants.slice(0, 5).map((m) => (
            <Avatar key={m.id} name={m.display_name} size="xs" ringClass="ring-card" />
          ))}
          {participants.length > 5 && (
            <span className="ml-1 text-[11px] text-ink-muted">
              +{participants.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-card bg-card hover:bg-card/80 transition border border-white/[0.04] p-4 no-tap-highlight"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="rounded-card bg-card border border-white/[0.04] p-4">
      {inner}
    </div>
  );
}

function pickEmoji(desc: string): string {
  const d = desc.toLowerCase();
  if (/(cab|uber|ola|taxi|auto|ride)/.test(d)) return "🚕";
  if (/(petrol|fuel|diesel|gas)/.test(d)) return "⛽";
  if (/(hotel|stay|airbnb|room|resort)/.test(d)) return "🏨";
  if (/(food|dinner|lunch|breakfast|swiggy|zomato|cafe|restaurant|pizza|biryani)/.test(d))
    return "🍽️";
  if (/(beer|wine|drink|booze|bar|club)/.test(d)) return "🍺";
  if (/(flight|plane|air|indigo|vistara)/.test(d)) return "✈️";
  if (/(train|irctc|rail)/.test(d)) return "🚆";
  if (/(grocery|kirana|market|bigbasket)/.test(d)) return "🛒";
  if (/(ticket|movie|show|concert)/.test(d)) return "🎟️";
  if (/(beach|water|pool|raft)/.test(d)) return "🏖️";
  if (/(snack|chai|coffee)/.test(d)) return "☕";
  return "💸";
}
