import { Metadata } from "next";
import { Suspense } from "react";
import CertificateDetailsClient from "./CertificateDetailsClient";

export const metadata: Metadata = {
  title: "Certificate Details",
  description: "View detailed information about an SSL/TLS certificate.",
};

export default function CertificateDetailPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Certificate Details...</div>}>
        <CertificateDetailsClient />
    </Suspense>
  );
}
