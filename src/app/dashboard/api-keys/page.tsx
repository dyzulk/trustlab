import React from "react";
import ApiKeyManagement from "@/components/api-keys/ApiKeyManagement";
import ApiUsageDocs from "@/components/ApiUsageDocs";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export const metadata = {
  title: "API Keys",
  description: "Manage your API access tokens.",
};

export default function ApiKeysPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6 lg:p-10">
      <PageBreadCrumb pageTitle="API Keys" />
      
      <div className="mt-6">
        <ApiKeyManagement />
        <ApiUsageDocs />
      </div>
    </div>
  );
}
