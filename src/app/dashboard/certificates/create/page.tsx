import { Metadata } from "next";
import CreateCertificateClient from "./CreateCertificateClient";

export const metadata: Metadata = {
  title: "Generate Certificate",
  description: "Issue a new SSL/TLS certificate through the TrustLab Certification Authority.",
};

export default function CreateCertificatePage() {
  return <CreateCertificateClient />;
}
