"use client";

import React from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageLoader from "@/components/ui/PageLoader";

import AdminLegalEditorClient from "../AdminLegalEditorClient";

export default function EditLegalPageClient({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/admin/legal-pages/${id}` : null,
    (url) => axios.get(url).then((res) => res.data)
  );

  if (!id) {
    return <div className="p-10 text-center text-red-500">Invalid Page ID provided.</div>;
  }

  if (isLoading) {
      return <PageLoader text="Loading page editor..." />;
  }

  if (error || !data) {
      return <div className="p-10 text-center text-red-500">Error loading page or page not found.</div>;
  }

  return <AdminLegalEditorClient mode="edit" initialData={data.data} />;
}
