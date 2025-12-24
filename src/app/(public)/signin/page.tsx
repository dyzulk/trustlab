import { Metadata } from "next";
import SigninClient from "./SigninClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your TrustLab account to manage your certificates and API keys.",
};

export default function Signin() {
  return <SigninClient />;
}
