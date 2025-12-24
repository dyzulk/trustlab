"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

// Helper for smooth scrolling
const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (!element) return;
    const navbarOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
};

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Theme toggle logic simplified for this component or reused from context
    // Assuming we might want to lift theme state up or use a provider.
    // For now, I'll add a placeholder toggle or just basic class toggle logic if not globally provided yet.
    // Note: The Header.tsx used local state or a store. Let's assume a simple toggle for now.
    
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                         {/* Using the migrated asset */}
                        <div className="relative w-10 h-10">
                            <img src="/images/logo/logo-icon.svg" alt="TrustLab Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                            TrustLab
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Home</Link>
                        
                        <a 
                            href="/#features" 
                            onClick={(e) => {
                                if (pathname === '/') {
                                    e.preventDefault();
                                    scrollToSection('#features');
                                }
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
                        >
                            Features
                        </a>

                        {/* Tools Dropdown */}
                        <div 
                            className="relative" 
                            onMouseEnter={() => setToolsOpen(true)}
                            onMouseLeave={() => setToolsOpen(false)}
                        >
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setToolsOpen(!toolsOpen);
                                }}
                                className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors py-2"
                            >
                                Tools
                                <svg className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {toolsOpen && (
                                <div className="absolute left-0 top-full pt-3 w-64 z-50">
                                    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden">
                                        <Link href="/tools/chat-id" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-brand-500 transition-all">
                                            <div className="w-8 h-8 bg-brand-50 dark:bg-brand-500/10 rounded-lg flex items-center justify-center text-brand-500">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            </div>
                                            <div>
                                                <div className="font-bold">Chat ID Finder</div>
                                                <div className="text-[10px] text-gray-400">Find your Telegram ID</div>
                                            </div>
                                        </Link>
                                        <Link href="/tools/key-generator" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-brand-500 transition-all">
                                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                            </div>
                                            <div>
                                                <div className="font-bold">App Key Generator</div>
                                                <div className="text-[10px] text-gray-400">Secure Laravel keys</div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Contact</Link>
                        {user ? (
                            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-bold">
                                Hi, {user.fname || 'User'}
                            </Link>
                        ) : (
                            <Link href="/signin" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Sign In</Link>
                        )}
                        
                        <ThemeToggle />

                        {user ? (
                             <button 
                                onClick={logout}
                                className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white rounded-xl font-semibold transition-all hover:bg-gray-200 dark:hover:bg-white/10"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link href="/signup" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/25 transition-all hover:scale-105">
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Mobile Header Actions */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600 dark:text-gray-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden bg-white dark:bg-gray-900 pt-24 px-6 animate-in slide-in-from-top-10 fade-in duration-300">
                    <div className="flex flex-col gap-6">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Home</Link>
                        <a 
                            href="/#features" 
                            onClick={(e) => {
                                setMobileOpen(false);
                                if (pathname === '/') {
                                    e.preventDefault();
                                    scrollToSection('#features');
                                }
                            }}
                            className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4"
                        >
                            Features
                        </a>
                        
                        {/* Mobile Tools (simplified) */}
                        <div className="space-y-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">Tools</div>
                            <div className="pl-4 space-y-3">
                                <Link href="/tools/chat-id" className="block text-gray-600 dark:text-gray-400 font-medium">Chat ID Finder</Link>
                                <Link href="/tools/key-generator" className="block text-gray-600 dark:text-gray-400 font-medium">App Key Generator</Link>
                            </div>
                        </div>

                        <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Contact</Link>
                        
                        {user ? (
                            <>
                                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-brand-500 border-b border-gray-100 dark:border-gray-800 pb-4">Dashboard</Link>
                                <button 
                                    onClick={() => {
                                        setMobileOpen(false);
                                        logout();
                                    }} 
                                    className="text-lg font-bold text-red-500 text-left"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/signin" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Sign In</Link>
                                <Link href="/signup" onClick={() => setMobileOpen(false)} className="mt-6 w-full py-4 bg-brand-500 text-white rounded-2xl font-bold text-center shadow-xl shadow-brand-500/20 block">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
