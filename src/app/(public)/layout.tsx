
import PublicLayout from "@/components/Layouts/PublicLayout";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
