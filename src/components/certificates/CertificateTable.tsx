"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { DownloadIcon, TrashBinIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import InputField from "../form/input/InputField";

interface Certificate {
  uuid: string;
  common_name: string;
  organization: string;
  serial_number: string;
  san: string;
  valid_from: string;
  valid_to: string;
  key_bits: number;
}

interface CertificateTableProps {
  certificates: Certificate[];
  onDelete: (uuid: string) => void;
}

export default function CertificateTable({
  certificates,
  onDelete,
}: CertificateTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [issuanceFilter, setIssuanceFilter] = useState("all");

  const isExpired = (validTo: string) => {
    if (!validTo) return false;
    return new Date(validTo) < new Date();
  };

  // Filtering logic
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const search = searchTerm.toLowerCase();
      
      // Search matching
      const matchesSearch = 
        cert.common_name.toLowerCase().includes(search) ||
        (cert.organization && cert.organization.toLowerCase().includes(search)) ||
        (cert.serial_number && cert.serial_number.toLowerCase().includes(search)) ||
        getIntermediateName(cert.key_bits).toLowerCase().includes(search) ||
        `${cert.key_bits}`.includes(search);

      // Status matching
      const expired = isExpired(cert.valid_to);
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "valid" && !expired) || 
        (statusFilter === "expired" && expired);

      // Issuance matching
      const matchesIssuance = 
        issuanceFilter === "all" || 
        (issuanceFilter === "2048" && cert.key_bits === 2048) || 
        (issuanceFilter === "4096" && cert.key_bits === 4096);

      return matchesSearch && matchesStatus && matchesIssuance;
    });
  }, [certificates, searchTerm, statusFilter, issuanceFilter]);

  const getIntermediateName = (bits: number) => {
    return bits === 4096 ? "Intermediate 4096" : "Intermediate 2048";
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCertificates.length / entriesPerPage);
  const paginatedCertificates = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredCertificates.slice(start, start + entriesPerPage);
  }, [filteredCertificates, currentPage, entriesPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-400 border border-gray-200 rounded-md dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

          <div className="flex items-center gap-4">
             <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-400 border border-gray-200 rounded-md dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={issuanceFilter}
              onChange={(e) => { setIssuanceFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-400 border border-gray-200 rounded-md dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none min-w-[120px]"
            >
              <option value="all">All Issuance</option>
              <option value="2048">Int 2048</option>
              <option value="4096">Int 4096</option>
            </select>

            {(statusFilter !== "all" || issuanceFilter !== "all" || searchTerm !== "") && (
              <button 
                onClick={() => {
                  setStatusFilter("all");
                  setIssuanceFilter("all");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="w-full sm:w-64">
          <InputField
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            className="!py-2"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Common Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Serial Number
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Issuance
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Validity
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedCertificates.map((cert) => (
                <TableRow key={cert.uuid} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="px-5 py-4 text-start">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {cert.common_name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {cert.organization || "No Organization"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start font-mono text-theme-xs text-gray-500 dark:text-gray-400">
                    {cert.serial_number || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex flex-col">
                      <span className="text-theme-xs font-medium text-gray-800 dark:text-white/90">
                        {getIntermediateName(cert.key_bits)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {cert.key_bits}-bit
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={isExpired(cert.valid_to) ? "error" : "success"}>
                      {isExpired(cert.valid_to) ? "Expired" : "Valid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col">
                      <span>From: {cert.valid_from ? new Date(cert.valid_from).toLocaleDateString() : "-"}</span>
                      <span>To: {cert.valid_to ? new Date(cert.valid_to).toLocaleDateString() : "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/certificates/${cert.uuid}`}
                        className="p-2 text-gray-500 hover:text-brand-500 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => onDelete(cert.uuid)}
                        className="p-2 text-gray-500 hover:text-error-500 transition-colors"
                        title="Delete Certificate"
                      >
                        <TrashBinIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedCertificates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? `No certificates matching "${searchTerm}"` : "No certificates found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-gray-500">
            Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, filteredCertificates.length)} of {filteredCertificates.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 text-sm rounded-md border transition ${
                  currentPage === p
                    ? "bg-brand-500 text-white border-brand-500"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
