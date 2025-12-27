"use client";

import Link from "next/link";
import CommonGridShape from "@/components/common/CommonGridShape";
import { useEffect, useState } from "react";
import axios from '@/lib/axios';
import { useTranslations } from "next-intl";

interface CaCertificate {
    name: string;
    type: string;
    serial: string;
    expires_at: string;
}

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
    const t = useTranslations("Home");
    const [certificates, setCertificates] = useState<CaCertificate[]>([]);
    const [loadingCerts, setLoadingCerts] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get('/api/public/ca-certificates');
                if (response.data.success) {
                    setCertificates(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch certificates", error);
            } finally {
                setLoadingCerts(false);
            }
        };

        fetchCertificates();
    }, []);

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
                            🚀 {t('hero_tag')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                            {t('hero_title_1')} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
                                {t('hero_title_2')}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            {t('hero_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                                {t('cta_create_account')}
                            </Link>
                            <a href="#features" onClick={(e) => handleScroll(e, '#features')} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                {t('cta_explore_features')}
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
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('features_title')}</h2>
                            <p className="text-gray-600 dark:text-gray-400">{t('features_desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('feature_1_title')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {t('feature_1_desc')}
                                </p>
                            </div>

                             {/* Feature 2 */}
                             <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11 9 13.536 7.464 12 4.929 14.536V17h2.472l4.243-4.243a6 6 0 018.828-5.743zM16.5 13.5V18h6v-4.5h-6z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('feature_2_title')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {t('feature_2_desc')}
                                </p>
                            </div>

                             {/* Feature 3 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('feature_3_title')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {t('feature_3_desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Store Section */}
                <section id="trust-store" className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
                     {/* Gradient Background */}
                    <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none">
                         <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('trust_store_title')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                {t('trust_store_desc')}
                            </p>
                        </div>

                        {loadingCerts ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {certificates.map((cert) => (
                                    <div key={cert.serial} className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                                                    cert.type === 'root' 
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' 
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                                }`}>
                                                    {cert.type === 'root' ? 'Root CA' : 'Intermediate CA'}
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{cert.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">Serial: {cert.serial}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <a 
                                                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/ca-certificates/${cert.serial}/download`} 
                                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    title="Download Standard CRT (PEM)"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    {t('download_standard')}
                                                </a>
                                                <a 
                                                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/ca-certificates/${cert.serial}/download?format=der`} 
                                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-500/20 font-medium text-sm hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
                                                    title="Download for Android (DER)"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.523 15.3414C17.523 16.7113 16.4805 17.7719 15.1743 17.7719C13.8681 17.7719 12.8257 16.7113 12.8257 15.3414C12.8257 13.9715 13.8681 12.9109 15.1743 12.9109C16.4805 12.9109 17.523 13.9715 17.523 15.3414ZM11.1714 15.3414C11.1714 16.7113 10.1289 17.7719 8.82276 17.7719C7.51659 17.7719 6.47412 16.7113 6.47412 15.3414C6.47412 13.9715 7.51659 12.9109 8.82276 12.9109C10.1289 12.9109 11.1714 13.9715 11.1714 15.3414ZM16.3262 5.86762L17.7119 3.44754C17.7981 3.29806 17.7513 3.10499 17.5932 3.01894C17.4391 2.92983 17.2505 2.97372 17.152 3.1232L15.7251 5.61793C14.0754 4.86961 12.1956 4.86961 10.5982 5.5645L9.1713 3.06977C9.0768 2.92028 8.88412 2.87234 8.73004 2.9654C8.5719 3.05144 8.52504 3.24451 8.6112 3.394L9.99708 5.8143C6.31383 7.82084 3.86221 11.6968 3.86221 16.0359H20.1378C20.1378 11.6968 17.6862 7.82084 16.3262 5.86762Z"/>
                                                    </svg>
                                                    {t('download_android')}
                                                </a>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <a 
                                                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/ca-certificates/${cert.serial}/download/windows`} 
                                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-500/20 font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                                                    title="Download Windows Installer (.bat)"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M0 3.449L9.75 2.134V11.3L0 11.3V3.449ZM9.75 12.7L0 12.7V20.551L9.75 19.166V12.7ZM10.5 1.998L24 0.166V11.3L10.5 11.3V1.998ZM10.5 12.7L24 12.7V23.834L10.5 21.966V12.7Z"/>
                                                    </svg>
                                                    {t('download_windows')}
                                                </a>
                                                 <a 
                                                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/ca-certificates/${cert.serial}/download/mac`} 
                                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl border border-gray-200 dark:border-gray-600 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title="Download macOS Profile (.mobileconfig)"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.03 1.59-.65.77-1.2 2.02-1.07 3.12 1.17.09 2.36-.73 3.03-1.6"/>
                                                    </svg>
                                                    {t('download_macos')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-brand-600 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta_ready_title')}</h2>
                                <p className="text-brand-100 mb-10 max-w-lg mx-auto">{t('cta_ready_desc')}</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/signup" className="px-8 py-4 bg-white text-brand-600 rounded-2xl font-bold hover:scale-105 transition-transform">
                                        {t('cta_free_account')}
                                    </Link>
                                    <Link href="/signin" className="px-8 py-4 bg-brand-700 text-white rounded-2xl font-bold hover:bg-brand-800 transition-colors">
                                        {t('cta_signin_portal')}
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
