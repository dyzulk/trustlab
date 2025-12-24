import { Metadata } from "next";
import TicketListClient from "./TicketListClient";

export const metadata: Metadata = {
  title: "Support Tickets",
  description: "Manage your support tickets and get assistance.",
};

export default function SupportPage() {
  return <TicketListClient />;
}
