import { Metadata } from "next";
import React from "react";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and update your personal information.",
};

export default function Profile() {
  return <ProfileClient />;
}
