"use client";

import React, { useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Plus, Search, MessageSquare, Clock, CheckCircle, AlertCircle, Paperclip, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { parseApiError } from "@/lib/utils";

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

export default function TicketListClient() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, mutate, isLoading } = useSWR("/api/support/tickets", fetcher);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Technical",
    priority: "medium",
    message: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Calculate remaining slots
      const remainingSlots = 5 - selectedFiles.length;

      if (newFiles.length > remainingSlots) {
         addToast(`You can only attach ${remainingSlots} more file(s). Max 5 totals.`, "error");
         return;
      }

      const validFiles = newFiles.slice(0, remainingSlots).filter(file => file.size <= 10 * 1024 * 1024);
      if (validFiles.length !== newFiles.length) {
         addToast("Some files skipped (max 10MB)", "warning");
      }
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("subject", newTicket.subject);
    formData.append("category", newTicket.category);
    formData.append("priority", newTicket.priority);
    formData.append("message", newTicket.message);
    selectedFiles.forEach(file => {
      formData.append("attachments[]", file);
    });

    try {
      await axios.post("/api/support/tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addToast("Ticket created successfully", "success");
      setIsModalOpen(false);
      setNewTicket({ subject: "", category: "Technical", priority: "medium", message: "" });
      setSelectedFiles([]);
      mutate();
    } catch (error: any) {
      console.error("Ticket creation error:", error.response?.data || error.message);
      addToast(parseApiError(error, "Failed to create ticket"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tickets = data?.data || [];
  const filteredTickets = tickets.filter((t: any) =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Support Tickets" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your tickets...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket: any) => (
            <Link
              key={ticket.id}
              href={`/dashboard/support/view?id=${ticket.id}`}
              className="block group"
            >
              <ComponentCard className="transition-all hover:border-brand-500 border-transparent border-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          #{ticket.ticket_number}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[ticket.status]}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors text-lg">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <AlertCircle size={14} />
                          {ticket.category}
                        </span>
                        <span className={`flex items-center gap-1 capitalize px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColors[ticket.priority]}`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                     <span className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-brand-500 font-bold group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        View Details
                     </span>
                  </div>
                </div>
              </ComponentCard>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
             <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-theme-lg">
                <MessageSquare size={40} className="text-gray-200" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tickets found</h3>
             <p className="text-gray-500 max-w-sm mx-auto mb-8">
                You haven't created any support tickets yet. If you need help, feel free to open a new ticket.
             </p>
             <button
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-theme-md"
             >
               Create Your First Ticket
             </button>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-dark w-full max-w-lg rounded-2xl shadow-theme-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Support Ticket</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="What's the issue about?"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  maxLength={255}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  >
                    <option>Technical</option>
                    <option>Billing</option>
                    <option>Account</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your problem in detail..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Attachments</label>
                 <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                       {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                             <span className="truncate max-w-[100px]">{file.name}</span>
                             <button type="button" onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                                <X size={12} />
                             </button>
                          </div>
                       ))}
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                       <Paperclip size={18} className="text-gray-400" />
                       <span className="text-sm text-gray-500">Click to attach files (Max 10MB each)</span>
                       <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.txt"
                       />
                    </label>
                 </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-theme-md disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
