import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the TrustLab team for technical support, legal inquiries, or partnership opportunities.",
};

export default function Contact() {
  return <ContactClient />;
}
