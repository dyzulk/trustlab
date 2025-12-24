import { Metadata } from "next";
import TicketDetailsClient from "../TicketDetailsClient";

export const metadata: Metadata = {
  title: "Ticket Details",
  description: "View and reply to your support ticket.",
};

export default function TicketDetailsPage() {
  return <TicketDetailsClient />;
}
