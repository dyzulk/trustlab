"use client";

import React, { useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import CertificateTable from "@/components/certificates/CertificateTable";
import { PlusIcon } from "@/icons";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/button/Button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CreateCertificateModal from "@/components/certificates/CreateCertificateModal";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function CertificatesClient() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data, error, mutate, isLoading } = useSWR("/api/certificates", fetcher);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmDeleteUuid, setConfirmDeleteUuid] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";

  const handleDelete = async (uuid: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/certificates/${uuid}`);
      mutate();
      addToast("Certificate deleted successfully", "success");
      setConfirmDeleteUuid(null);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to delete certificate", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetupCa = async () => {
    setIsSettingUp(true);
    try {
      await axios.post("/api/ca/setup");
      mutate();
      addToast("CA Setup Successful", "success");
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to setup CA", "error");
    } finally {
      setIsSettingUp(false);
    }
  };

  if (error) return <div className="p-10 text-center text-error-500">Failed to load certificates.</div>;

  const certificates = data?.data?.data || [];
  const caStatus = data?.ca_status;
  const caReady = caStatus?.is_ready;
  
  // Defaults for the modal
  const createDefaults = {
    organizationName: "TrustLab CA",
    localityName: "Jakarta",
    stateOrProvinceName: "DKI Jakarta",
    countryName: "ID"
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Certificates" />
      
      <div className="space-y-6">
        {!caReady && !isLoading && (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-600 rounded-md flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">CA Not Fully Setup</span>
              <span className="text-xs text-yellow-700 dark:text-yellow-300">
                The Certification Authority system is missing: {caStatus?.missing?.join(", ").replace(/_/g, " ")}. 
                Certificates cannot be generated until setup is complete.
              </span>
              {!isAdmin && (
                <span className="mt-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                  Please contact your administrator to initialize the Certification Authority.
                </span>
              )}
            </div>
            {isAdmin && (
              <Button 
                onClick={handleSetupCa}
                variant="primary"
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 border-none h-auto"
                loading={isSettingUp}
              >
                Setup CA Now
              </Button>
            )}
          </div>
        )}

        <ComponentCard 
          title="Certificate Management" 
          desc="Manage and download your SSL/TLS certificates"
          headerAction={
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!caReady}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 ${!caReady ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <PlusIcon className="w-4 h-4" />
              Generate New
            </button>
          }
        >
          <CertificateTable 
            certificates={certificates} 
            onDelete={setConfirmDeleteUuid} 
          />
          
          {(isLoading || isDeleting) && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10 backdrop-blur-sm rounded-2xl">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </ComponentCard>
      </div>

      <CreateCertificateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => mutate()}
        defaults={createDefaults}
      />

      <ConfirmationModal
        isOpen={confirmDeleteUuid !== null}
        onClose={() => setConfirmDeleteUuid(null)}
        onConfirm={() => confirmDeleteUuid && handleDelete(confirmDeleteUuid)}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate? This action cannot be undone and any applications using this certificate might stop working."
        isLoading={isDeleting}
        confirmLabel="Delete"
        requiredInput="DELETE"
      />
    </div>
  );
}
