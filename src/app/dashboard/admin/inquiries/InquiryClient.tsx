"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/button/Button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Eye, Trash, Mail, Calendar, Search, MessageSquare, Send, X } from "lucide-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function InquiryClient() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const { data, error, mutate, isLoading } = useSWR("/api/admin/inquiries", fetcher);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/inquiries/${id}`);
      mutate();
      addToast("Inquiry deleted successfully", "success");
      setConfirmDeleteId(null);
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to delete inquiry", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      addToast("Please enter a reply message", "error");
      return;
    }

    setIsReplying(true);
    try {
      await axios.post(`/api/admin/inquiries/${selectedInquiry.id}/reply`, {
        message: replyMessage
      });
      addToast("Reply sent successfully", "success");
      mutate();
      setSelectedInquiry(null);
      setReplyMessage("");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to send reply", "error");
    } finally {
      setIsReplying(false);
    }
  };

  const inquiries = data?.data || [];

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((iq: any) => {
      const matchesSearch = 
        iq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        iq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iq.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || iq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  if (error) return <div className="p-10 text-center text-error-500">Failed to load inquiries.</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Inquiries" />
      
      <div className="space-y-6">
        <ComponentCard 
          title="Contact Inquiries" 
          desc="Manage and respond to messages sent from the public contact form"
          headerAction={
            <div className="flex items-center gap-3">
               <div className="relative hidden sm:block">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none w-64 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-transparent outline-none dark:bg-gray-900 dark:text-white/90"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          }
        >
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Sender</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Subject / Category</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((iq: any) => (
                    <tr key={iq.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{iq.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{iq.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{iq.subject}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Category: {iq.category}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${iq.status === 'replied' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'}`}>
                          {iq.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                         <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(iq.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric"
                            })}
                         </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedInquiry(iq)}
                            className="p-2 text-gray-400 hover:text-brand-500 transition-colors"
                            title="View / Reply"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(iq.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                      No inquiries found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          
          {(isLoading || isDeleting) && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10 backdrop-blur-sm rounded-2xl">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </ComponentCard>
      </div>

      <ConfirmationModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Delete Inquiry"
        message="Are you sure you want to delete this message? This action cannot be undone."
        isLoading={isDeleting}
        confirmLabel="Delete"
        requiredInput="DELETE"
      />

      {/* Inquiry View / Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isReplying && setSelectedInquiry(null)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Inquiry Details</h3>
                  <p className="text-xs text-gray-500">{selectedInquiry.subject}</p>
                </div>
              </div>
              <button 
                onClick={() => !isReplying && setSelectedInquiry(null)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                disabled={isReplying}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sender</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedInquiry.name}</p>
                  <p className="text-xs text-gray-500">{selectedInquiry.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Details</p>
                  <p className="text-sm text-gray-900 dark:text-white font-bold">{selectedInquiry.category}</p>
                  <p className="text-xs text-gray-500">Received {new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Message</p>
                <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap italic">
                  "{selectedInquiry.message}"
                </div>
              </div>

              {selectedInquiry.status === 'replied' && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20">
                  <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-1 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Replied on {new Date(selectedInquiry.replied_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Quick Reply</p>
                   <a 
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                    className="text-[10px] text-brand-500 hover:underline font-bold"
                   >
                    Use external mail client
                   </a>
                </div>
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full rounded-2xl border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white p-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none min-h-[120px] transition-all"
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedInquiry(null)}
                disabled={isReplying}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSendReply}
                loading={isReplying}
                startIcon={<Send className="w-4 h-4" />}
              >
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
