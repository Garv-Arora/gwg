"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
  ExpenseWithSplits,
  Settlement,
  Trip,
  TripMember,
} from "@/types";

type State =
  | { status: "loading" }
  | { status: "error"; error: string }
  | {
      status: "ready";
      trip: Trip;
      members: TripMember[];
      expenses: ExpenseWithSplits[];
      settlements: Settlement[];
    };

type Ctx = {
  state: State;
  refresh: () => Promise<void>;
};

const TripCtx = createContext<Ctx | null>(null);

export function TripProvider({
  tripId,
  children,
}: {
  tripId: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State>({ status: "loading" });

  const refresh = useCallback(async () => {
    try {
      const data = await api.getTrip(tripId);
      setState({
        status: "ready",
        trip: data.trip,
        members: data.members,
        expenses: data.expenses,
        settlements: data.settlements,
      });
    } catch (e) {
      setState({
        status: "error",
        error: e instanceof Error ? e.message : "Couldn't load trip",
      });
    }
  }, [tripId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <TripCtx.Provider value={{ state, refresh }}>{children}</TripCtx.Provider>;
}

export function useTrip(): Ctx {
  const ctx = useContext(TripCtx);
  if (!ctx) throw new Error("useTrip must be inside TripProvider");
  return ctx;
}
