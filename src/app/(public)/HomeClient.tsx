"use client";

import Link from "next/link";
import CommonGridShape from "@/components/common/CommonGridShape";
import { useEffect, useState } from "react";

// Simple internal ScrollToTop component
function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.pageYOffset > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const element = document.querySelector('#home');
        if (element) {
             const navbarOffset = 80;
             const elementPosition = element.getBoundingClientRect().top;
             const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
             window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth",
             });
        }
    };

    if (!show) return null;

    return (
        <button 
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow-2xl shadow-brand-500/40 transition-all hover:-translate-y-1 active:scale-95 animate-in fade-in slide-in-from-bottom-5"
            aria-label="Back to top"
        >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
}

export default function HomeClient() {
    // Smooth scrolling implementation for features link (reused from layout logic or simplified here)
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            const navbarOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative flex-grow flex flex-col">
                {/* Hero Section */}
                <header className="relative pt-32 pb-20 overflow-hidden" id="home">
                    {/* Background Shapes */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
                            🚀 Unified Certificate Management
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                            Secure Your Assets with <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
                                Trusted Certificate Authority
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            Issue, manage, and track SSL/TLS certificates and API keys through a powerful, developer-friendly management system.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                                Create Global Account
                            </Link>
                            <a href="#features" onClick={(e) => handleScroll(e, '#features')} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                Explore Features
                            </a>
                        </div>

                         {/* Preview/Abstract UI */}
                        <div className="mt-20 relative mx-auto max-w-5xl">
                            <div className="aspect-video bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl p-4 overflow-hidden group">
                                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 ml-4 h-6 bg-gray-100 dark:bg-gray-900/50 rounded-lg max-w-xs"></div>
                                </div>
                                {/* Mock Dashboard Content */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 space-y-4">
                                        <div className="h-40 bg-brand-500/5 rounded-2xl border border-brand-500/10"></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl"></div>
                                            <div className="h-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl"></div>
                                    </div>
                                </div>
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features for Modern Apps</h2>
                            <p className="text-gray-600 dark:text-gray-400">Everything you need to manage your security layer efficiently.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Custom CA Issuance</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Issue professional Root and Intermediate CA certificates with a single click. Fully compliant with standard encryption protocols.
                                </p>
                            </div>

                             {/* Feature 2 */}
                             <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11 9 13.536 7.464 12 4.929 14.536V17h2.472l4.243-4.243a6 6 0 018.828-5.743zM16.5 13.5V18h6v-4.5h-6z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">API Management</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Secure your external services with granular API keys. Track usage patterns and revoke access instantly when needed.
                                </p>
                            </div>

                             {/* Feature 3 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Monitor issuance trends and expiring certificates through intuitive analytical dashboards and automated alerts.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-brand-600 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your application?</h2>
                                <p className="text-brand-100 mb-10 max-w-lg mx-auto">Join hundreds of developers managing their security infrastructure with TrustLab.</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/signup" className="px-8 py-4 bg-white text-brand-600 rounded-2xl font-bold hover:scale-105 transition-transform">
                                        Create Free Account
                                    </Link>
                                    <Link href="/signin" className="px-8 py-4 bg-brand-700 text-white rounded-2xl font-bold hover:bg-brand-800 transition-colors">
                                        Sign In to Portal
                                    </Link>
                                </div>
                            </div>
                             {/* Abstract Design */}
                             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <CommonGridShape />
                            </div>
                        </div>
                    </div>
                </section>

                 {/* Back to Top Button */}
                <ScrollToTop />
            </div>
    );
}
