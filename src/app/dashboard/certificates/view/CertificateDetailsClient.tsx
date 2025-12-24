"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CertificateDetails from "@/components/certificates/CertificateDetails";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function CertificateDetailsClient() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');
  const { data, error, isLoading } = useSWR(`/api/certificates/${uuid}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
