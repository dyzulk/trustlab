import { Metadata } from "next";
import UsersManagementClient from "./UsersManagementClient";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users, roles, and permissions within TrustLab.",
};

export default function UserManagementPage() {
  return <UsersManagementClient />;
}
