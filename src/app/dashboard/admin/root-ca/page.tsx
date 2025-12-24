import { Metadata } from "next";
import RootCaManagementClient from "./RootCaManagementClient";

export const metadata: Metadata = {
  title: "Root CA Management",
  description: "Manage your Certification Authorities, including Root and Intermediate certificates.",
};

export default function RootCaManagementPage() {
  return <RootCaManagementClient />;
}
