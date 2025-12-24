"use client";

import React from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import AdminLegalEditorClient from "../AdminLegalEditorClient";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function EditLegalPageClient({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR(`/api/admin/legal-pages/${id}`, fetcher);

  if (isLoading) {
      return <div className="p-10 text-center">Loading page data...</div>;
  }

  if (error || !data) {
      return <div className="p-10 text-center text-red-500">Error loading page or page not found.</div>;
  }

  return <AdminLegalEditorClient mode="edit" initialData={data.data} />;
}
