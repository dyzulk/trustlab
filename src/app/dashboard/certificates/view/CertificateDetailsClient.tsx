"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageLoader from "@/components/ui/PageLoader";

import CertificateDetails from "@/components/certificates/CertificateDetails";

export default function CertificateDetailsClient() {
  const searchParams = useSearchParams();
  const idOrUuid = searchParams.get("uuid") || searchParams.get("id");

  const { data, error, isLoading } = useSWR(
    idOrUuid ? `/api/certificates/${idOrUuid}` : null,
    (url) => axios.get(url).then((res) => res.data)
  );

  if (isLoading) {
    return <PageLoader text="Loading certificate details..." />;
  }

  if (error || !data?.data) {
    return (
      <div className="p-10 text-center text-error-500">
        Failed to load certificate details. It may not exist or you don't have permission.
      </div>
    );
  }

  const certificate = data.data;

  return (
    <div>
      <PageBreadcrumb pageTitle={`${certificate.common_name} Details`} />
      
      <div className="space-y-6">
        <CertificateDetails certificate={certificate} />
      </div>
    </div>
  );
}
