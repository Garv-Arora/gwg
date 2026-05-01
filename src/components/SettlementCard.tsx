import { Avatar } from "./MemberChip";
import { MoneyText } from "./MoneyText";
import type { TripMember } from "@/types";

type Props = {
  from: TripMember | undefined;
  to: TripMember | undefined;
  amount: number;
  status?: "pending" | "settled";
  onSettle?: () => void;
  onUnsettle?: () => void;
  onWhatsapp?: () => void;
  busy?: boolean;
};

export function SettlementCard({
  from,
  to,
  amount,
  status = "pending",
  onSettle,
  onUnsettle,
  onWhatsapp,
  busy,
}: Props) {
  const settled = status === "settled";

  return (
    <div
      className={`rounded-card border p-4 transition ${
        settled
          ? "bg-mint-soft border-mint/30"
          : "bg-card border-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={from?.display_name ?? "?"} size="md" ringClass="ring-card" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink-secondary truncate">
            <span className="text-ink-primary font-medium">
              {from?.display_name ?? "Someone"}
            </span>{" "}
            <span className="text-ink-muted">pays</span>{" "}
            <span className="text-ink-primary font-medium">
              {to?.display_name ?? "Someone"}
            </span>
          </p>
          <div className="mt-1">
            <MoneyText value={amount} size="lg" tone={settled ? "credit" : "gold"} />
          </div>
        </div>
        <Avatar name={to?.display_name ?? "?"} size="md" ringClass="ring-card" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        {settled ? (
          <button
            onClick={onUnsettle}
            disabled={busy}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-pill bg-soft/70 text-ink-secondary text-sm hover:text-ink-primary disabled:opacity-50"
          >
            <CheckIcon /> Settled · undo
          </button>
        ) : (
          <button
            onClick={onSettle}
            disabled={busy}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-pill bg-mint text-bg text-sm font-semibold hover:bg-mint-deep disabled:opacity-50"
          >
            <CheckIcon /> Mark settled
          </button>
        )}
        {onWhatsapp && (
          <button
            onClick={onWhatsapp}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-pill bg-[#25D366]/15 text-[#25D366] text-sm hover:bg-[#25D366]/25"
            aria-label="Remind on WhatsApp"
          >
            <WAIcon /> Remind
          </button>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WAIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 3.4 16.7L2 22l5.5-1.4A11 11 0 1 0 20.5 3.5Zm-8.6 17a9 9 0 0 1-4.6-1.3l-.3-.2-3.3.8.9-3.2-.2-.3a9 9 0 1 1 7.5 4.2Zm5-6.7c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1l-1 1.2c-.2.2-.4.3-.7.1a7.4 7.4 0 0 1-3.6-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-1-2.4c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7c0 1.6 1.1 3.1 1.3 3.3.2.3 2.3 3.5 5.7 4.9 2 .8 2.8.9 3.8.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.4Z" />
    </svg>
  );
}
