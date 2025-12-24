"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Eye, Edit3 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EditorProps {
  mode: "create" | "edit";
  initialData?: any;
}

export default function AdminLegalEditorClient({ mode, initialData }: EditorProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Load history if edit mode
  const [versionHistory, setVersionHistory] = useState<any[]>([]);

  // Computed potential parents
  const [majors, setMajors] = useState<number[]>([]);
  const [minors, setMinors] = useState<number[]>([]);

  useEffect(() => {
     if (mode === 'edit' && initialData?.id) {
         axios.get(`/api/admin/legal-pages/${initialData.id}/history`)
            .then(res => {
                const hist = res.data.data;
                setVersionHistory(hist);
                
                // Extract unique majors
                const m = Array.from(new Set(hist.map((r: any) => r.major))) as number[];
                setMajors(m.sort((a,b) => b-a));
            })
            .catch(err => console.error(err));
     }
  }, [mode, initialData]);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.latest_revision?.content || "",
    status: initialData?.latest_revision?.status || 'draft',
    change_log: "",
    
    // Versioning State
    version_type: 'patch', // major, minor, patch
    parent_major: initialData?.latest_revision?.major || 1,
    parent_minor: initialData?.latest_revision?.minor || 0,
  });

  // Update minors dropdown when parent_major changes
  useEffect(() => {
      if (mode === 'edit') {
           const relevantRevisions = versionHistory.filter((r: any) => r.major === Number(formData.parent_major));
           const m = Array.from(new Set(relevantRevisions.map((r: any) => r.minor))) as number[];
           setMinors(m.sort((a,b) => b-a));
           
           // default to 0 or first avail
           if (!m.includes(Number(formData.parent_minor))) {
               setFormData(prev => ({...prev, parent_minor: m[0] || 0}));
           }
      }
  }, [formData.parent_major, versionHistory, mode]);


  const handleSubmit = async (e: React.FormEvent, submitStatus: 'draft' | 'published') => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await axios.post("/api/admin/legal-pages", {
            title: formData.title,
            content: formData.content,
            status: submitStatus
        });
        addToast("Legal page created successfully", "success");
      } else {
        await axios.put(`/api/admin/legal-pages/${initialData.id}`, {
            title: formData.title,
            content: formData.content,
            status: submitStatus,
            change_log: formData.change_log,
            version_type: formData.version_type,
            parent_major: formData.parent_major,
            parent_minor: formData.parent_minor
        });
        addToast("Legal page updated successfully", "success");
      }
      router.push("/dashboard/admin/legal");
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to save page", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Compute Next Version String for visualization
  const getNextVersion = () => {
      if (mode === 'create') return "1.0.0";
      
      let nextMajor = 0, nextMinor = 0, nextPatch = 0;
      
      if (formData.version_type === 'major') {
          const maxMaj = majors.length > 0 ? Math.max(...majors) : 0;
          nextMajor = maxMaj + 1; 
      } else if (formData.version_type === 'minor') {
          nextMajor = Number(formData.parent_major);
          const relevant = versionHistory.filter(r => r.major === nextMajor).map(r => r.minor);
          const maxMin = relevant.length ? Math.max(...relevant) : -1;
          nextMinor = maxMin + 1;
      } else {
          nextMajor = Number(formData.parent_major);
          nextMinor = Number(formData.parent_minor);
           const relevant = versionHistory.filter(r => r.major === nextMajor && r.minor === nextMinor).map(r => r.patch);
           const maxPatch = relevant.length ? Math.max(...relevant) : -1;
           nextPatch = maxPatch + 1;
      }
      return `${nextMajor}.${nextMinor}.${nextPatch}`;
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={mode === "create" ? "Create Legal Page" : "Edit Legal Page"} />

      <Link
        href="/dashboard/admin/legal"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to List
      </Link>

      <form>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ComponentCard title="Page Content">
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Page Title
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    >
                        <option value="" disabled>Select a Page Title</option>
                        <option value="Privacy Policy">Privacy Policy</option>
                        <option value="Terms and Conditions">Terms and Conditions</option>
                        <option value="Cookie Policy">Cookie Policy</option>
                        <option value="Disclaimer">Disclaimer</option>
                        <option value="Acceptable Use Policy">Acceptable Use Policy</option>
                    </select>
                  </div>
                  
                  {/* Markdown Editor Tabs */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                          <button
                            type="button"
                            onClick={() => setActiveTab('write')}
                            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 ${activeTab === 'write' ? 'bg-white dark:bg-gray-800 text-brand-600 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                          >
                             <Edit3 size={16} /> Write
                          </button>
                           <button
                             type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 ${activeTab === 'preview' ? 'bg-white dark:bg-gray-800 text-brand-600 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                          >
                             <Eye size={16} /> Preview
                          </button>
                      </div>

                      {activeTab === 'write' ? (
                        <div className="relative">
                            <textarea
                              required
                              rows={20}
                              className="w-full px-4 py-4 bg-white dark:bg-gray-900 border-none focus:ring-0 font-mono text-sm text-gray-900 dark:text-gray-300 resize-y"
                              placeholder="# Privacy Policy\n\nWrite your content in Markdown..."
                              value={formData.content}
                              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                               Markdown Supported
                            </div>
                        </div>
                      ) : (
                         <div className="p-6 prose dark:prose-invert max-w-none min-h-[500px] bg-white dark:bg-gray-900 
                            prose-headings:font-bold prose-headings:!mt-1 prose-headings:!mb-0
                            prose-p:!leading-tight prose-p:!my-0 
                            prose-ul:!my-0 prose-ol:!my-0 
                            prose-li:!my-0 prose-li:!leading-tight [&_li_p]:!my-0
                            prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-img:rounded-xl whitespace-pre-wrap">
                            {formData.content ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content}</ReactMarkdown>
                            ) : (
                                <p className="text-gray-500 italic">No content to preview</p>
                            )}
                         </div>
                      )}
                  </div>
               </div>
            </ComponentCard>
          </div>

          <div className="space-y-6">
            <ComponentCard title="Publishing">
               <div className="space-y-6">
                  {/* Status Indicator */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                         Current Status
                      </label>
                      <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                              {formData.status}
                          </span>
                          {formData.status === 'published' && <span className="text-xs text-green-600 flex items-center">Live on Site</span>}
                      </div>
                  </div>

                  {mode === 'edit' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                       Version Update Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['major', 'minor', 'patch'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData(prev => ({...prev, version_type: type}))}
                                className={`px-2 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                                    formData.version_type === type 
                                    ? 'bg-brand-50 dark:bg-brand-500/20 border-brand-500 text-brand-600 dark:text-brand-400' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Parent Selectors for Minor/Patch */}
                    {(formData.version_type === 'minor' || formData.version_type === 'patch') && (
                        <div>
                             <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Parent Major</label>
                             <select 
                                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                value={formData.parent_major}
                                onChange={(e) => setFormData(prev => ({...prev, parent_major: Number(e.target.value)}))}
                             >
                                 {majors.map(m => <option key={m} value={m}>v{m}.x.x</option>)}
                             </select>
                        </div>
                    )}

                    {formData.version_type === 'patch' && (
                         <div>
                             <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Parent Minor</label>
                             <select 
                                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                value={formData.parent_minor}
                                onChange={(e) => setFormData(prev => ({...prev, parent_minor: Number(e.target.value)}))}
                             >
                                 {minors.map(m => <option key={m} value={m}>v{formData.parent_major}.{m}.x</option>)}
                             </select>
                        </div>
                    )}

                     <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 text-sm font-medium text-center border border-blue-100 dark:border-blue-500/20">
                        Next Version: <span className="font-bold">{getNextVersion()}</span>
                     </div>
                  </div>
                  )}
                  
                  {mode === "edit" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Change Log
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                          placeholder="What changed?"
                          value={formData.change_log}
                          onChange={(e) => setFormData({ ...formData, change_log: e.target.value })}
                        />
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                      >
                        <Save size={18} />
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'published')}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-theme-md disabled:opacity-50"
                      >
                         <Eye size={18} />
                         Publish
                      </button>
                  </div>
               </div>
            </ComponentCard>
          </div>
        </div>
      </form>
    </div>
  );
}
