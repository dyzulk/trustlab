"use client";

import Navbar from "./Public/Navbar";
import Footer from "./Public/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden font-sans flex flex-col">
            {/* Background Glow Effects (Glow in the dark) */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[120px] opacity-20 dark:opacity-60 transition-opacity duration-500"></div>
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/5 dark:bg-brand-500/10 rounded-full blur-[150px] opacity-10 dark:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[100px] opacity-20 dark:opacity-50 transition-opacity duration-500"></div>
            </div>

            <Navbar />
                <main className="relative z-10 flex-grow flex flex-col">
                    {children}
                </main>
            <Footer />
        </div>
    );
}
