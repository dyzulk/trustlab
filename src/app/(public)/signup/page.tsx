import { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join TrustLab to start issuing and managing your certificates and API keys.",
};

export default function Signup() {
  return <SignupClient />;
}
