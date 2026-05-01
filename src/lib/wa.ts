import { formatINR } from "./format";
import type { Transfer, TripMember } from "@/types";

export function waLink(text: string, phone?: string | null): string {
  const encoded = encodeURIComponent(text);
  if (phone) {
    const num = phone.replace(/[^\d]/g, "");
    return `https://wa.me/${num}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export function buildGroupSummary(
  tripName: string,
  emoji: string,
  transfers: Transfer[],
  membersById: Record<string, TripMember>,
  appUrl: string,
  inviteCode: string,
): string {
  const lines = [
    `${emoji} *${tripName}* — UdhariClub settlement`,
    "",
  ];
  if (transfers.length === 0) {
    lines.push("All settled, sab barabar! 🎉");
  } else {
    transfers.forEach((t, i) => {
      const from = membersById[t.from]?.display_name ?? "Someone";
      const to = membersById[t.to]?.display_name ?? "Someone";
      lines.push(`${i + 1}. ${from} → ${to}: ${formatINR(t.amount)}`);
    });
  }
  lines.push("", `Track on UdhariClub: ${appUrl}/join/${inviteCode}`);
  return lines.join("\n");
}

export function buildPersonalReminder(
  tripName: string,
  fromName: string,
  toName: string,
  amount: number,
): string {
  return [
    `Hey ${toName}! 👋`,
    "",
    `Quick udhari reminder from *${tripName}*:`,
    `${fromName} owes you ${formatINR(amount)} — please settle up jab time mile.`,
    "",
    "Sent via UdhariClub 🌿",
  ].join("\n");
}
