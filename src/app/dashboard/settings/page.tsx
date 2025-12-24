import { Metadata } from "next";
import React from "react";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account security, activity, and preferences.",
};

export default function SettingsPage() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Account Settings
        </h3>
        <SettingsClient />
      </div>
    </div>
  );
}
