export type User = {
  id: string;
  phone: string;
  name: string;
  created_at: string;
};

export type Trip = {
  id: string;
  name: string;
  emoji: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
};

export type TripMember = {
  id: string;
  trip_id: string;
  user_id: string | null;
  display_name: string;
  phone: string | null;
  joined_at: string;
};

export type SplitType = "equal" | "unequal";

export type Expense = {
  id: string;
  trip_id: string;
  payer_id: string;
  description: string;
  amount: number;
  split_type: SplitType;
  created_at: string;
};

export type ExpenseSplit = {
  id: string;
  expense_id: string;
  member_id: string;
  amount: number;
};

export type ExpenseWithSplits = Expense & {
  splits: ExpenseSplit[];
  payer?: TripMember;
};

export type SettlementStatus = "pending" | "settled";

export type Settlement = {
  id: string;
  trip_id: string;
  from_member: string;
  to_member: string;
  amount: number;
  status: SettlementStatus;
  created_at: string;
  settled_at: string | null;
};

export type Balance = {
  member_id: string;
  net: number; // +ve => should receive, -ve => owes
};

export type Transfer = {
  from: string;
  to: string;
  amount: number;
};
