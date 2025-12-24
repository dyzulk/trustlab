"use client";

import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Badge from "../ui/badge/Badge";
import { CopyIcon, CheckLineIcon, DownloadIcon } from "@/icons";

interface Certificate {
  uuid: string;
  common_name: string;
  organization: string;
  locality: string;
  state: string;
  country: string;
  san: string;
  key_bits: number;
  serial_number: string;
  cert_content: string;
  key_content: string;
  csr_content: string;
  valid_from: string;
  valid_to: string;
}

interface CertificateDetailsProps {
  certificate: Certificate;
}

export default function CertificateDetails({ certificate }: CertificateDetailsProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const isExpired = new Date(certificate.valid_to) < new Date();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Metadata Card */}
      <ComponentCard title="Certificate Metadata" desc="Subject and validity information">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
            <Badge size="sm" color={isExpired ? "error" : "success"}>
              {isExpired ? "Expired" : "Valid"}
            </Badge>
          </div>
          <DetailRow label="Common Name (CN)" value={certificate.common_name} />
          <DetailRow label="Organization (O)" value={certificate.organization || "-"} />
          <DetailRow label="Locality (L)" value={certificate.locality || "-"} />
          <DetailRow label="State (ST)" value={certificate.state || "-"} />
          <DetailRow label="Country (C)" value={certificate.country || "-"} />
          <DetailRow label="Key Strength" value={`${certificate.key_bits} bits`} />
          <DetailRow label="Serial Number" value={certificate.serial_number} mono />
          <DetailRow label="Alternative Names (SAN)" value={certificate.san || "-"} mono />
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <DetailRow label="Valid From" value={new Date(certificate.valid_from).toLocaleString()} />
            <DetailRow label="Valid To" value={new Date(certificate.valid_to).toLocaleString()} />
          </div>
        </div>
      </ComponentCard>

      {/* PEM Content Sections */}
      <div className="space-y-6">
        <PemSection 
          title="Certificate (CRT)" 
          content={certificate.cert_content} 
          sectionId="cert"
          onCopy={copyToClipboard}
          isCopied={copiedSection === "cert"}
        />
        <PemSection 
          title="Private Key (KEY)" 
          content={certificate.key_content} 
          sectionId="key"
          onCopy={copyToClipboard}
          isCopied={copiedSection === "key"}
          isSecret
        />
        {certificate.csr_content && (
          <PemSection 
            title="Certificate Signing Request (CSR)" 
            content={certificate.csr_content} 
            sectionId="csr"
            onCopy={copyToClipboard}
            isCopied={copiedSection === "csr"}
          />
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-medium text-gray-800 dark:text-white/90 ${mono ? "font-mono break-all" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function PemSection({ 
  title, 
  content, 
  sectionId, 
  onCopy, 
  isCopied, 
  isSecret = false 
}: { 
  title: string; 
  content: string; 
  sectionId: string;
  onCopy: (text: string, id: string) => void;
  isCopied: boolean;
  isSecret?: boolean;
}) {
  const [showSecret, setShowSecret] = useState(!isSecret);

  return (
    <ComponentCard 
      title={title}
      headerAction={
        <div className="flex items-center gap-3">
          {isSecret && (
            <button 
              onClick={() => setShowSecret(!showSecret)}
              className="flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 shadow-xs transition-colors"
            >
              {showSecret ? "Hide" : "Show"}
            </button>
          )}
          <button 
            onClick={() => onCopy(content, sectionId)}
            className="flex items-center justify-center p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 shadow-xs transition-colors"
            title="Copy to Clipboard"
          >
            {isCopied ? <CheckLineIcon className="w-4 h-4 text-success-500" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      }
    >
      <div className={`h-48 overflow-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 custom-scrollbar ${isSecret && !showSecret ? "filter blur-sm select-none" : ""}`}>
        <pre className="text-xs font-mono leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
          {content}
        </pre>
      </div>
    </ComponentCard>
  );
}
