import { Metadata } from "next";
import KeyGeneratorClient from "./KeyGeneratorClient";

export const metadata: Metadata = {
  title: "APP_KEY Generator",
  description: "Securely generate production-ready Larvel APP_KEY in your browser.",
};

export default function AppKeyGenerator() {
  return <KeyGeneratorClient />;
}
