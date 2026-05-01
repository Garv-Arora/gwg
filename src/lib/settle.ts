import type {
  Balance,
  ExpenseWithSplits,
  Settlement,
  Transfer,
  TripMember,
} from "@/types";

/**
 * Compute net balance per member from the raw expense + split rows.
 *
 *   payer_balance += expense.amount
 *   participant_balance -= split.amount
 *
 * Confirmed (settled) transfers are also folded in:
 *   from_balance += amount
 *   to_balance   -= amount
 */
export function computeBalances(
  members: TripMember[],
  expenses: ExpenseWithSplits[],
  settlements: Settlement[] = [],
): Balance[] {
  const balances = new Map<string, number>();
  for (const m of members) balances.set(m.id, 0);

  for (const exp of expenses) {
    const payer = balances.get(exp.payer_id) ?? 0;
    balances.set(exp.payer_id, payer + Number(exp.amount));
    for (const s of exp.splits) {
      const cur = balances.get(s.member_id) ?? 0;
      balances.set(s.member_id, cur - Number(s.amount));
    }
  }

  for (const s of settlements) {
    if (s.status !== "settled") continue;
    const from = balances.get(s.from_member) ?? 0;
    const to = balances.get(s.to_member) ?? 0;
    balances.set(s.from_member, from + Number(s.amount));
    balances.set(s.to_member, to - Number(s.amount));
  }

  return Array.from(balances.entries()).map(([member_id, net]) => ({
    member_id,
    net,
  }));
}

/**
 * Reduce a set of net balances to the minimum number of transfers.
 *
 * Repeatedly: take the largest creditor and the largest debtor, transfer
 * min(|debt|, credit) between them, update, repeat. Differences below ₹1
 * are treated as settled noise.
 */
export function simplifySettlements(balances: Balance[]): Transfer[] {
  const creditors: { id: string; amt: number }[] = [];
  const debtors: { id: string; amt: number }[] = [];

  for (const b of balances) {
    const rounded = Math.round(b.net);
    if (rounded > 0) creditors.push({ id: b.member_id, amt: rounded });
    else if (rounded < 0) debtors.push({ id: b.member_id, amt: -rounded });
  }

  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);

  const transfers: Transfer[] = [];

  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const amount = Math.min(d.amt, c.amt);
    if (amount >= 1) {
      transfers.push({ from: d.id, to: c.id, amount });
    }
    d.amt -= amount;
    c.amt -= amount;
    if (d.amt < 1) i++;
    if (c.amt < 1) j++;
  }

  return transfers.sort((a, b) => b.amount - a.amount);
}

/**
 * Build an equal split. The last member absorbs any rounding remainder so
 * shares always sum to the exact total in paise.
 */
export function buildEqualSplit(
  amount: number,
  memberIds: string[],
): { member_id: string; amount: number }[] {
  if (memberIds.length === 0) return [];
  const totalPaise = Math.round(amount * 100);
  const base = Math.floor(totalPaise / memberIds.length);
  const remainder = totalPaise - base * memberIds.length;
  return memberIds.map((id, idx) => ({
    member_id: id,
    amount: (base + (idx === memberIds.length - 1 ? remainder : 0)) / 100,
  }));
}
