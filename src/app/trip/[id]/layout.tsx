"use client";

import { useParams } from "next/navigation";
import { TripProvider } from "@/components/TripContext";
import { ToastProvider } from "@/components/Toast";

export default function TripLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const tripId = (params.id ?? "").toString();
  return (
    <ToastProvider>
      <TripProvider tripId={tripId}>{children}</TripProvider>
    </ToastProvider>
  );
}
