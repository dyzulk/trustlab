"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LegalPageLink {
    title: string;
    slug: string;
}

export default function Footer() {
    const [legalPages, setLegalPages] = useState<LegalPageLink[]>([]);

    useEffect(() => {
        const fetchLegalPages = async () => {
            try {
                // Use public API endpoint
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/public/legal-pages`, {
                    headers: { 'Accept': 'application/json' }
                });
                
                if (res.ok) {
                    const json = await res.json();
                    setLegalPages(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch footer links", error);
            }
        };

        fetchLegalPages();
    }, []);

    return (
        <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex flex-wrap justify-center gap-6 mb-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <Link href="/contact" className="hover:text-brand-500 transition-colors">Contact</Link>
                    
                    {legalPages.map((page) => (
                        <Link 
                            key={page.slug} 
                            href={`/legal/view?slug=${page.slug}`}  
                            className="hover:text-brand-500 transition-colors"
                        >
                            {page.title}
                        </Link>
                    ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    &copy; 2023-{new Date().getFullYear()} TrustLab by <a href="https://www.dyzulk.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">DyzulkDev</a>. Built for security and performance.
                </p>
            </div>
        </footer>
    );
}
