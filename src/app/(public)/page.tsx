import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Welcome to TrustLab",
  description: "Advanced Certificate Authority and PKI Management System. Issue and manage SSL/TLS certificates and API keys with ease.",
};

export default function Home() {
  return <HomeClient />;
}
