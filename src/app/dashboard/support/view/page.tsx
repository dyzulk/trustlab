import { Metadata } from "next";
import { Suspense } from "react";
import TicketDetailsClient from "../TicketDetailsClient";

export const metadata: Metadata = {
  title: "Ticket Details",
  description: "View and reply to your support ticket.",
};

export default function TicketDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Ticket...</div>}>
        <TicketDetailsClient />
    </Suspense>
  );
}
