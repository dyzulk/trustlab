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
import Button from "../ui/button/Button";
import InputField from "../form/input/InputField";

interface CaCertificate {
  uuid: string;
  ca_type: string;
  common_name: string;
  serial_number: string;
  valid_from: string;
  valid_to: string;
  status: string;
}

interface RootCaTableProps {
  certificates: CaCertificate[];
  onRenew: (uuid: string) => void;
  isRenewing: boolean;
}

export default function RootCaTable({
  certificates,
  onRenew,
  isRenewing,
}: RootCaTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const search = searchTerm.toLowerCase();
      return (
        cert.common_name.toLowerCase().includes(search) ||
        cert.ca_type.toLowerCase().includes(search) ||
        cert.serial_number.toLowerCase().includes(search)
      );
    });
  }, [certificates, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end px-1">
        <div className="w-full sm:w-64">
          <InputField
            placeholder="Search CA..."
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
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
                  Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Common Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Serial Number
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Validity Period
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredCertificates.map((cert) => (
                <TableRow key={cert.uuid} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                    {formatType(cert.ca_type)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    {cert.common_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start font-mono text-theme-xs text-gray-500 dark:text-gray-400">
                    {cert.serial_number}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col">
                      <span>{new Date(cert.valid_from).toLocaleString()}</span>
                      <span className="text-gray-400">to</span>
                      <span>{new Date(cert.valid_to).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={cert.status === "valid" ? "success" : "error"}>
                      {cert.status === "valid" ? "Valid" : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <Button size="sm" onClick={() => onRenew(cert.uuid)} loading={isRenewing}>
                      Renew (10Y)
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCertificates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? `No CA matching "${searchTerm}"` : "No Root CA certificates found. Run CA Setup from the Certificates page."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
