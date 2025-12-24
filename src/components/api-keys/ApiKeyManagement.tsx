"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "@/lib/axios";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { TrashBinIcon, CopyIcon, CheckLineIcon, PlusIcon, LockIcon, BoltIcon } from "@/icons";
import { useToast } from "@/context/ToastContext";
import ConfirmationModal from "../common/ConfirmationModal";

interface ApiKey {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function ApiKeyManagement() {
  const { data, error, isLoading } = useSWR("/api/api-keys", fetcher);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  // Confirmation states
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [confirmRegenerateId, setConfirmRegenerateId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    try {
      const response = await axios.post("/api/api-keys", { name: newKeyName });
      setGeneratedKey(response.data.token);
      setNewKeyName("");
      mutate("/api/api-keys");
      addToast("API Key generated successfully", "success");
    } catch (err) {
      addToast("Failed to generate API Key", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setIsRevoking(id);
    try {
      await axios.delete(`/api/api-keys/${id}`);
      mutate("/api/api-keys");
      addToast("API Key revoked successfully", "success");
      setConfirmRevokeId(null);
    } catch (err) {
      addToast("Failed to revoke API Key", "error");
    } finally {
      setIsRevoking(null);
    }
  };

  const handleToggle = async (id: string) => {
    setIsToggling(id);
    try {
      await axios.patch(`/api/api-keys/${id}/toggle`);
      mutate("/api/api-keys");
      addToast("API Key status updated", "success");
    } catch (err) {
      addToast("Failed to update status", "error");
    } finally {
      setIsToggling(null);
    }
  };

  const handleRegenerate = async (id: string) => {
    setIsRegenerating(id);
    try {
      const response = await axios.post(`/api/api-keys/${id}/regenerate`);
      setGeneratedKey(response.data.token);
      mutate("/api/api-keys");
      addToast("API Key regenerated", "success");
      setConfirmRegenerateId(null);
    } catch (err) {
      addToast("Failed to regenerate key", "error");
    } finally {
      setIsRegenerating(null);
    }
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const keys = data?.data || [];

  return (
    <div className="space-y-6">
      <ComponentCard 
        title="Generate New API Key" 
        desc="Create a new personal access token for external automation."
      >
        {!generatedKey ? (
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Key Name (e.g. CI/CD Pipeline)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:bg-white/[0.03] text-gray-800 dark:text-white/90 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>
            <Button 
              type="submit" 
              loading={isCreating}
              disabled={!newKeyName.trim()}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-brand-700 dark:text-brand-400">Your API Key</span>
              <span className="text-xs text-brand-600 dark:text-brand-500 font-normal italic">Copy this now, you won't see it again!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-brand-200 dark:border-brand-500/30 text-gray-800 dark:text-white font-mono text-sm break-all">
                {generatedKey}
              </div>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-500/30 rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <CheckLineIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setGeneratedKey(null)}>
                    Done
                </Button>
            </div>
          </div>
        )}
      </ComponentCard>

      <ComponentCard title="Active API Keys" desc="Manage your existing personal access tokens.">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Used</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                  <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-500">Loading keys...</td>
                  </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500 italic">No API keys generated yet.</td>
                </tr>
              ) : (
                keys.map((key: ApiKey) => (
                  <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                          <LockIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">{key.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => handleToggle(key.id)}
                        disabled={isToggling === key.id}
                        title={key.is_active ? "Click to deactivate" : "Click to activate"}
                      >
                        <Badge color={key.is_active ? "success" : "warning"}>
                          {isToggling === key.id ? "..." : (key.is_active ? "Active" : "Inactive")}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : "Never used"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmRegenerateId(key.id)}
                          disabled={isRegenerating === key.id}
                          className="p-2 text-gray-400 hover:text-brand-500 transition-colors disabled:opacity-50"
                          title="Regenerate Key"
                        >
                          <BoltIcon className={`w-5 h-5 ${isRegenerating === key.id ? "animate-spin" : ""}`} />
                        </button>
                        <button
                          onClick={() => setConfirmRevokeId(key.id)}
                          disabled={isRevoking === key.id}
                          className="p-2 text-gray-400 hover:text-error-500 transition-colors disabled:opacity-50"
                          title="Revoke Key"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ConfirmationModal
        isOpen={confirmRevokeId !== null}
        onClose={() => setConfirmRevokeId(null)}
        onConfirm={() => confirmRevokeId && handleRevoke(confirmRevokeId)}
        title="Revoke API Key"
        message="Are you sure you want to revoke this API Key? Any applications using it will lose access immediately. This action cannot be undone."
        isLoading={isRevoking !== null}
        confirmLabel="Revoke Key"
        requiredInput="REVOKE"
      />

      <ConfirmationModal
        isOpen={confirmRegenerateId !== null}
        onClose={() => setConfirmRegenerateId(null)}
        onConfirm={() => confirmRegenerateId && handleRegenerate(confirmRegenerateId)}
        title="Regenerate API Key"
        message="Are you sure you want to regenerate this API Key? The existing key will stop working immediately, and you will be given a new key string."
        isLoading={isRegenerating !== null}
        confirmLabel="Regenerate"
        variant="warning"
      />
    </div>
  );
}
