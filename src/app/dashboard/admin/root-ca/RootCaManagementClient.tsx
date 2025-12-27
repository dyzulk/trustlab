"use client";

import React, { useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import RootCaTable from "@/components/admin/RootCaTable";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import PageLoader from "@/components/ui/PageLoader";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function RootCaManagementClient() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const { data, error, mutate, isLoading } = useSWR("/api/admin/ca-certificates", fetcher);
  const [isRenewing, setIsRenewing] = useState(false);
  const [confirmRenewUuid, setConfirmRenewUuid] = useState<string | null>(null);

  // Redirect if not admin (double security, backend also checks)
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleRenew = async (uuid: string) => {
    setIsRenewing(true);
    try {
      await axios.post(`/api/admin/ca-certificates/${uuid}/renew`, {
        days: 3650
      });
      mutate();
      addToast("CA Certificate renewed successfully.", "success");
      setConfirmRenewUuid(null);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to renew CA certificate", "error");
    } finally {
      setIsRenewing(false);
    }
  };

  if (error) return <div className="p-10 text-center text-error-500">Failed to load CA certificates. Admin access required.</div>;

  const certificates = data?.data || [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Root CA Management" />

      <div className="space-y-6">
        <ComponentCard
          title="CA Certificates"
          desc="Manage Root and Intermediate Certification Authorities"
          className="relative"
        >
          <RootCaTable
            certificates={certificates}
            onRenew={setConfirmRenewUuid}
            isRenewing={isRenewing}
          />

          {(isLoading || isRenewing) && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10 backdrop-blur-sm rounded-2xl">
              <PageLoader text="Processing..." className="h-full" />
            </div>
          )}
        </ComponentCard>
        
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 dark:bg-blue-900/20 dark:border-blue-600 rounded-md">
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200">Information</h4>
            <ul className="mt-2 text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                <li>Renewing a CA certificate generates a new public certificate with a 10-year validity period.</li>
                <li>The existing private key is preserved to maintain the validity of existing leaf certificates.</li>
                <li>Intermediate certificates are signed by the currently active Root CA.</li>
                <li>Always download and re-distribute the new Root CA to clients after significant changes.</li>
            </ul>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmRenewUuid !== null}
        onClose={() => setConfirmRenewUuid(null)}
        onConfirm={() => confirmRenewUuid && handleRenew(confirmRenewUuid)}
        title="Renew CA Certificate"
        message="Are you sure you want to renew this CA certificate for 10 years? This will generate a new certificate string while keeping the same private key."
        isLoading={isRenewing}
        confirmLabel="Renew Certificate"
        variant="warning"
        requiredInput="RENEW"
      />
    </div>
  );
}
