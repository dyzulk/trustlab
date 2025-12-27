import { Suspense } from "react";
import { Metadata } from "next";
import SetPasswordClient from "./SetPasswordClient";

export const metadata: Metadata = {
  title: "Set Password",
  description: "Set your account password to complete registration.",
};

export default function SetPassword() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    }>
      <SetPasswordClient />
    </Suspense>
  );
}
