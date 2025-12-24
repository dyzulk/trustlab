import { Metadata } from "next";
import AdminTicketListClient from "./AdminTicketListClient";

export const metadata: Metadata = {
  title: "Ticket Management",
  description: "Manage and reply to customer support tickets.",
};

export default function AdminTicketsPage() {
  return <AdminTicketListClient />;
}
