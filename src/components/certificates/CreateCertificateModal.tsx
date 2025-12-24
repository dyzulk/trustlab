"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Modal } from "../ui/modal";
import axios from "@/lib/axios";
import Button from "../ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { useToast } from "@/context/ToastContext";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface CreateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaults?: any;
}

export default function CreateCertificateModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  defaults 
}: CreateCertificateModalProps) {
  const { addToast } = useToast();
  const { data: user } = useSWR("/api/user", fetcher);
  
  const [loading, setLoading] = useState(false);
  const [configMode, setConfigMode] = useState<"default" | "manual">("default");
  const [isTestShortLived, setIsTestShortLived] = useState(false);
  
  const [formData, setFormData] = useState({
    common_name: "",
    organization: defaults?.organizationName || "",
    locality: defaults?.localityName || "",
    state: defaults?.stateOrProvinceName || "",
    country: defaults?.countryName || "ID",
    key_bits: "2048",
    san: "",
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        common_name: "",
        organization: defaults?.organizationName || "",
        locality: defaults?.localityName || "",
        state: defaults?.stateOrProvinceName || "",
        country: defaults?.countryName || "ID",
        key_bits: "2048",
        san: "",
      });
      setConfigMode("default");
      setIsTestShortLived(false);
    }
  }, [isOpen, defaults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/certificates", {
        ...formData,
        config_mode: configMode,
        is_test_short_lived: isTestShortLived,
      });
      addToast("Certificate generated successfully", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to generate certificate", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
          Generate New Certificate
        </h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Enter domain and metadata for your new certificate
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Common Name (CN) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. example.com or *.example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-brand-500 outline-none transition"
                value={formData.common_name}
                onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject Alternative Names (SAN)
              </label>
              <textarea
                placeholder="e.g. DNS:auth.example.com, IP:1.2.3.4 (comma separated)"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-brand-500 outline-none transition h-20"
                value={formData.san}
                onChange={(e) => setFormData({ ...formData, san: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">
                 Comma separated list of additional domains or IP addresses.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key Strength
              </label>
              <select
                 className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 focus:ring-2 focus:ring-brand-500 outline-none transition"
                 value={formData.key_bits}
                 onChange={(e) => setFormData({ ...formData, key_bits: e.target.value })}
              >
                <option value="2048" className="dark:bg-gray-900">2048-bit (Standard)</option>
                <option value="4096" className="dark:bg-gray-900">4096-bit (Highly Secure)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Configuration Mode
              </label>
              <div className="flex items-center gap-4 py-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={configMode === "default"} 
                      onChange={() => setConfigMode("default")} 
                      className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-400">Default Metadata</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={configMode === "manual"} 
                      onChange={() => setConfigMode("manual")} 
                      className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-400">Manual Control</span>
                 </label>
              </div>
            </div>

            {configMode === "manual" && (
              <>
                <div className="col-span-1 sm:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Manual CSR Fields</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization (O)
                  </label>
                   <input
                    type="text"
                    placeholder="e.g. TrustLab Inc"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-brand-500 outline-none transition"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Locality (L)
                  </label>
                   <input
                    type="text"
                    placeholder="e.g. Jakarta"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-brand-500 outline-none transition"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State (ST)
                  </label>
                   <input
                    type="text"
                    placeholder="e.g. DKI Jakarta"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-brand-500 outline-none transition"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country (C - ISO Code)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none transition"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
             <div>
               {user?.role === 'admin' && (
                  <div className="flex items-center gap-2">
                     <Checkbox 
                          checked={isTestShortLived}
                          onChange={(checked) => setIsTestShortLived(checked as boolean)}
                          label="Test Mode: 30s Validity"
                     />
                     <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/10 px-2 py-0.5 rounded font-mono">ADMIN ONLY</span>
                  </div>
               )}
             </div>
             <div className="flex gap-3">
              <Button
                  variant="outline"
                  onClick={onClose}
                  type="button"
              >
                  Cancel
              </Button>
              <Button
                  type="submit"
                  loading={loading}
              >
                  Generate Certificate
              </Button>
             </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
