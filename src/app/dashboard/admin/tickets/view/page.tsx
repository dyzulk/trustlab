import { Metadata } from "next";
import { Suspense } from "react";
import AdminTicketDetailsClient from "../AdminTicketDetailsClient";

export const metadata: Metadata = {
  title: "Support Ticket Management",
  description: "View and resolve customer support tickets.",
};

export default function AdminTicketDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Ticket Details...</div>}>
       <AdminTicketDetailsClient />
    </Suspense>
  );
}
