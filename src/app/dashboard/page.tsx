import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | TrustLab",
  description: "View your metrics and system status.",
};

export default function DashboardPage() {
  return (
      <DashboardClient />
  );
}
