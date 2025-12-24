"use client";

import React, { useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Plus, Search, FileText, ChevronRight, Edit3, Trash2 } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function AdminLegalListClient() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, mutate, isLoading } = useSWR("/api/admin/legal-pages", fetcher);

  const pages = data?.data || [];
  const filteredPages = pages.filter((page: any) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) return;

    try {
      await axios.delete(`/api/admin/legal-pages/${id}`);
      addToast("Legal page deleted successfully", "success");
      mutate();
    } catch (error) {
      addToast("Failed to delete page", "error");
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Legal Pages Management" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
             <Search size={18} />
           </span>
           <input
             type="text"
             placeholder="Search pages..."
             className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 text-gray-900 dark:text-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <Link
          href="/dashboard/admin/legal/create"
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus size={20} />
          Create New Page
        </Link>
      </div>

      <ComponentCard title="Legal Pages List" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title / Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Version</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
               {isLoading ? (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                        Loading legal pages...
                     </td>
                  </tr>
               ) : filteredPages.length === 0 ? (
                  <tr>
                     <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                        No legal pages found.
                     </td>
                  </tr>
               ) : (
                  filteredPages.map((page: any) => (
                    <tr key={page.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                         <div>
                            <div className="font-bold text-gray-900 dark:text-white">{page.title}</div>
                            <code className="text-xs text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-1.5 py-0.5 rounded border border-brand-100 dark:border-brand-800/30">
                               /{page.slug}
                            </code>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                            v{page.latest_revision?.version || '1.0'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                         {new Date(page.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Link 
                               href={`/legal/${page.slug}`} 
                               target="_blank"
                               className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                               title="View Public Page"
                            >
                               <FileText size={16} />
                            </Link>
                            <Link 
                               href={`/dashboard/admin/legal/${page.id}`}
                               className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                               title="Edit Page"
                            >
                               <Edit3 size={16} />
                            </Link>
                            <button 
                               onClick={() => handleDelete(page.id)}
                               className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                               title="Delete Page"
                            >
                               <Trash2 size={16} />
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
    </div>
  );
}
