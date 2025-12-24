"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function LegalPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
        setLoading(false);
        return;
    }

    const fetchPage = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/public/legal-pages/${slug}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const json = await res.json();
                setPage(json.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!page) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-blue-600 dark:from-brand-400 dark:to-blue-400 mb-4">
              {page.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Version {page.version}</span>
              <span>•</span>
              <span>Last updated: {new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Marketing/Styled Content */}
          <article className="prose dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight 
              prose-headings:!mt-1 prose-headings:!mb-0
              prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-500 
              prose-img:rounded-2xl prose-hr:border-gray-200 dark:prose-hr:border-gray-800
              prose-p:!leading-tight prose-p:!my-0 
              prose-ul:!my-0 prose-ol:!my-0 
              prose-li:!my-0 prose-li:!leading-tight [&_li_p]:!my-0
              whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}

export default function PublicLegalPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <LegalPageContent />
        </Suspense>
    );
}
