"use client";

import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, Clock, CheckCircle, AlertCircle, User, MessageSquare, XCircle, Paperclip, FileText, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { getUserAvatar, parseApiError } from "@/lib/utils";
import Image from "next/image";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const statusColors: any = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
  answered: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400",
};

export default function TicketDetailsClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { addToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const { data: ticket, mutate, isLoading } = useSWR(`/api/support/tickets/${id}`, fetcher);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.replies]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Calculate remaining slots
      const remainingSlots = 5 - selectedFiles.length;
      
      if (newFiles.length > remainingSlots) {
         addToast(`You can only attach ${remainingSlots} more file(s). Max 5 totals.`, "error");
         return;
      }

      // Validate size (approx 10MB)
      const validFiles = newFiles.slice(0, remainingSlots).filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length !== newFiles.length) {
         addToast("Some files were skipped (max 10MB limit).", "warning");
      }

      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() && selectedFiles.length === 0) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("message", replyMessage);
    selectedFiles.forEach(file => {
      formData.append("attachments[]", file);
    });

    try {
      await axios.post(`/api/support/tickets/${id}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReplyMessage("");
      setSelectedFiles([]);
      mutate();
      addToast("Reply sent successfully", "success");
    } catch (error: any) {
      console.error("Reply error:", error.response?.data || error.message);
      addToast(parseApiError(error, "Failed to send reply"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      await axios.patch(`/api/support/tickets/${id}/close`);
      mutate();
      addToast("Ticket closed", "success");
      setIsCloseModalOpen(false);
    } catch (error: any) {
      console.error("Close ticket error:", error.response?.data || error.message);
      addToast(parseApiError(error, "Failed to close ticket"), "error");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading conversation...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <Link 
            href="/dashboard/support"
            className="flex items-center gap-2 text-gray-500 hover:text-brand-500 transition-colors font-medium group"
         >
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
                <ArrowLeft size={18} />
            </div>
            Back to Tickets
         </Link>

         {ticket.status !== 'closed' && (
            <button
               onClick={() => setIsCloseModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/5 rounded-lg hover:bg-red-100 transition-colors"
            >
               <XCircle size={18} />
               Close Ticket
            </button>
         )}
      </div>

      <ComponentCard className="p-0 overflow-hidden border-none shadow-theme-xl">
        {/* Ticket Header */}
        <div className="p-6 bg-gray-50 dark:bg-white/2 border-b border-gray-100 dark:border-gray-800">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{ticket.ticket_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[ticket.status]}`}>
                        {ticket.status}
                    </span>
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Category</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{ticket.category}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Priority</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{ticket.priority}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Created</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{new Date(ticket.created_at).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Conversation Area */}
        <div 
           ref={scrollRef}
           className="h-[500px] overflow-y-auto p-6 space-y-6 flex flex-col custom-scrollbar dark:bg-gray-900/50"
        >
          {ticket.replies?.map((reply: any) => {
            const isMe = reply.user_id === user?.id;
            return (
              <div 
                key={reply.id} 
                className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className="flex-shrink-0">
                  <Image
                    width={40}
                    height={40}
                    src={getUserAvatar(reply.user)}
                    alt={reply.user?.name || "User"}
                    className="rounded-full shadow-sm"
                    unoptimized={true}
                  />
                </div>
                <div className={`space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                        {reply.user?.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div 
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-theme-xs ${
                      isMe 
                        ? 'bg-brand-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {reply.message}

                    {/* Attachments Display */}
                    {reply.attachments && reply.attachments.length > 0 && (
                       <div className="mt-3 space-y-2">
                          {reply.attachments.map((att: any) => (
                             <a 
                               key={att.id} 
                               href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${att.file_path}`} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                                  isMe 
                                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                                  : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                               }`}
                             >
                                <FileText size={14} />
                                <span className="truncate max-w-[150px]">{att.file_name}</span>
                             </a>
                          ))}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Toolbox */}
        {ticket.status !== 'closed' ? (
           <div className="p-6 bg-white dark:bg-gray-dark border-t border-gray-100 dark:border-gray-800">
              {selectedFiles.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-3">
                    {selectedFiles.map((file, idx) => (
                       <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                          <span className="truncate max-w-[100px]">{file.name}</span>
                          <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                             <X size={12} />
                          </button>
                       </div>
                    ))}
                 </div>
              )}

              <form onSubmit={handleReply} className="relative">
                 <textarea
                   rows={3}
                   placeholder="Type your message here... (Ctrl+Enter to send)"
                   className="w-full p-4 pr-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-brand-500 resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-white/20 text-gray-900 dark:text-white"
                   value={replyMessage}
                   onChange={(e) => setReplyMessage(e.target.value)}
                   onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                         e.preventDefault();
                         handleReply(e as any);
                      }
                   }}
                 />
                 
                 <div className="absolute right-3 bottom-3 flex gap-2">
                    <input 
                       type="file" 
                       multiple 
                       className="hidden" 
                       ref={fileInputRef} 
                       onChange={handleFileChange}
                       accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.txt"
                    />
                    <button
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="p-3 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                       title="Attach Files"
                    >
                       <Paperclip size={20} />
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || (!replyMessage.trim() && selectedFiles.length === 0)}
                      className="p-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all shadow-theme-md disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400"
                    >
                      <Send size={20} />
                    </button>
                 </div>
              </form>
              <p className="mt-2 text-[10px] text-gray-400 text-center italic">
                 Enter for new line, Ctrl + Enter to send. Supports Multiple Files.
              </p>
            </div>
        ) : (
           <div className="p-10 text-center bg-gray-100 dark:bg-white/5 border-t border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-theme-lg border border-gray-200 dark:border-gray-700">
                 <CheckCircle size={32} className="text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ticket Closed</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This conversation has been resolved and closed.</p>
           </div>
        )}
      </ComponentCard>

      <ConfirmationModal
         isOpen={isCloseModalOpen}
         onClose={() => setIsCloseModalOpen(false)}
         onConfirm={handleCloseTicket}
         title="Close Ticket"
         message="Are you sure you want to close this ticket? You won't be able to reply until it's reopened by an administrator."
         confirmLabel="Yes, Close Ticket"
         variant="danger"
      />
    </div>
  );
}
