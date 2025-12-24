"use client";

import React, { useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Search, MessageSquare, Clock, Filter, ChevronRight, User as UserIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { getUserAvatar } from "@/lib/utils";
import Image from "next/image";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const statusColors: any = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
  answered: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400",
};

const priorityColors: any = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
};

export default function AdminTicketListClient() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, mutate, isLoading } = useSWR("/api/support/tickets?all=true", fetcher);

  const tickets = data?.data || [];
  const filteredTickets = tickets.filter((t: any) => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${t.user?.first_name} ${t.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Support Ticket Management" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by ticket, subject, or user..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 text-gray-900 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Total: <span className="text-brand-500 font-bold">{filteredTickets.length}</span> tickets
        </div>
      </div>

      <ComponentCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/2 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket / User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500 italic">Syncing tickers...</p>
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket: any) => (
                  <tr key={ticket.id} className="group hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                           width={36}
                           height={36}
                           src={getUserAvatar(ticket.user)}
                           alt={ticket.user?.first_name ? `${ticket.user.first_name} ${ticket.user.last_name}` : "User"}
                           className="rounded-full shadow-sm"
                           unoptimized={true}
                        />
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{ticket.ticket_number}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.user?.first_name} {ticket.user?.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="max-w-xs overflow-hidden">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{ticket.subject}</p>
                          <p className="text-xs text-gray-500 capitalize">{ticket.category}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                       {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link 
                         href={`/dashboard/admin/tickets/view?id=${ticket.id}`}
                         className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors uppercase tracking-widest"
                       >
                         Manage <ChevronRight size={14} />
                       </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-gray-500 font-medium italic">No support tickets found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}
