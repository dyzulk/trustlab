import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';

interface LegalPageProps {
  params: {
    slug: string;
  };
}

// Helper to separate data fetching
async function getLegalPage(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log(`[LegalPage] Fetching: ${apiUrl}/api/public/legal-pages/${slug}`);
    
    const res = await fetch(`${apiUrl}/api/public/legal-pages/${slug}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
        console.error(`[LegalPage] Fetch failed: ${res.status} ${res.statusText}`);
        if (res.status === 404) return null;
        throw new Error(`Failed to fetch legal page: ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("[LegalPage] Error fetching page:", error);
    return null;
  }
}

export default async function PublicLegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getLegalPage(slug);

  if (!page) {
    notFound();
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
