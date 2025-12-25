import { Rocket } from "lucide-react";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Services | TrustLab",
  description: "Manage your services.",
};

export default function MyServicesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mb-6">
        <Rocket className="w-10 h-10 text-brand-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        My Services
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        We are building a dedicated dashboard for you to manage all your active services, subscriptions, and usage details in one place.
      </p>
      <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium">
        Coming Soon
      </div>
    </div>
  );
}
