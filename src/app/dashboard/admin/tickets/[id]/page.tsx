import { Metadata } from "next";
import AdminTicketDetailsClient from "../AdminTicketDetailsClient";

export const metadata: Metadata = {
  title: "Support Ticket Management",
  description: "View and resolve customer support tickets.",
};

export default function AdminTicketDetailsPage() {
  return <AdminTicketDetailsClient />;
}
