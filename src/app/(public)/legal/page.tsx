"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Scale, FileText } from 'lucide-react';
import axios from '@/lib/axios';

interface LegalPageItem {
  title: string;
  slug: string;
}

export default function LegalIndexPage() {
  const [pages, setPages] = useState<LegalPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/public/legal-pages`);
        setPages(data.data as LegalPageItem[]);
      } catch (error) {
        console.error("Failed to fetch legal pages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
       {/* Hero Section */}
       <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100 via-transparent to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
             <div className="inline-flex items-center justify-center p-3 bg-brand-50 dark:bg-brand-500/10 rounded-2xl mb-6 text-brand-600 dark:text-brand-400">
                <Scale size={32} />
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Legal Center
             </h1>
             <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transparency and trust are at the core of our mission. Review our terms, policies, and compliance documents below.
             </p>
          </div>
       </div>

       {/* Content Section */}
       <div className="max-w-5xl mx-auto px-6 py-12 -mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {isLoading ? (
                <div className="col-span-full py-20 text-center">
                   <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="text-gray-500">Loading legal documents...</p>
                </div>
             ) : (
                 <>
                    {pages.map((page) => (
                        <Link 
                           key={page.slug} 
                           href={`/legal/view?slug=${page.slug}`}
                           className="group bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                 <FileText size={20} />
                              </div>
                              <div>
                                 <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    {page.title}
                                 </h2>
                                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Read full document
                                 </p>
                              </div>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-brand-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                              <ArrowRight size={14} />
                           </div>
                        </Link>
                    ))}

                    {pages.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                           <p>No legal documents are currently published.</p>
                        </div>
                    )}
                 </>
             )}
          </div>
       </div>
    </div>
  );
}
