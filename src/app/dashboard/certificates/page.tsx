import { Metadata } from "next";
import CertificatesClient from "./CertificatesClient";

export const metadata: Metadata = {
  title: "Certificates",
  description: "View and manage your SSL/TLS certificates.",
};

export default function CertificatesPage() {
  return <CertificatesClient />;
}
