import { Metadata } from "next";
import CertificateDetailsClient from "./CertificateDetailsClient";

export const metadata: Metadata = {
  title: "Certificate Details",
  description: "View detailed information about an SSL/TLS certificate.",
};

export default function CertificateDetailPage() {
  return <CertificateDetailsClient />;
}
