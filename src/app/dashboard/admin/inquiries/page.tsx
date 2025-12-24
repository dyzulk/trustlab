import { Metadata } from "next";
import InquiryClient from "./InquiryClient";

export const metadata: Metadata = {
  title: "Contact Inquiries",
  description: "View and respond to inquiries from the public contact form.",
};

export default function InquiriesPage() {
  return <InquiryClient />;
}
