"use client";

import React from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CertificateCreateForm from "@/components/certificates/CertificateCreateForm";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function CreateCertificateClient() {
  const { data, isLoading } = useSWR("/api/certificates", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // The API doesn't explicitly return defaults in index yet, but we can assume or wait for refined API
  const defaults = {
    organizationName: "TrustLab CA",
    localityName: "Jakarta",
    stateOrProvinceName: "DKI Jakarta",
    countryName: "ID"
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Generate Certificate" />
      
      <div className="max-w-4xl mx-auto">
        <CertificateCreateForm defaults={defaults} />
      </div>
    </div>
  );
}
