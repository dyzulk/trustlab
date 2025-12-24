"use client";

import { useState, useEffect } from "react";

export default function KeyGeneratorClient() {
    const [generatedKey, setGeneratedKey] = useState("");
    const [copying, setCopying] = useState(false);

    const generate = () => {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        const binary = Array.from(array, (byte) => String.fromCharCode(byte)).join('');
        setGeneratedKey('base64:' + btoa(binary));
    };

    const copy = () => {
        if (!generatedKey) return;
        navigator.clipboard.writeText(generatedKey);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    useEffect(() => {
        generate();
    }, []);

    return (
        <div className="pt-32 pb-20 px-4 relative z-10 flex-grow flex flex-col">
            <div className="max-w-2xl mx-auto space-y-12 relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                        🔐 Security Utility
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Key Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Generate a production-ready 32-byte <code>APP_KEY</code> for your Laravel application securely in your browser.
                    </p>
                </div>

                <div className="bg-white px-8 py-10 shadow-2xl rounded-[2.5rem] dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">Your Generated Security Key</label>
                            <div className="relative group">
                                <div className="w-full rounded-2xl border-gray-200 bg-gray-50/50 p-6 text-sm font-mono text-gray-900 transition dark:border-gray-700 dark:bg-gray-800/50 dark:text-white break-all text-center min-h-[60px] flex items-center justify-center">
                                    {generatedKey || 'Generating...'}
                                </div>
                                
                                {generatedKey && (
                                    <button 
                                        onClick={copy}
                                        className="absolute top-1/2 -right-4 -translate-y-1/2 p-4 bg-brand-500 text-white rounded-2xl shadow-xl shadow-brand-500/30 hover:scale-110 transition-all active:scale-95"
                                        title="Copy to clipboard"
                                    >
                                        {!copying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        )}
                                    </button>
                                )}
                                
                                {copying && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                        COPIED TO CLIPBOARD
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                onClick={generate}
                                className="flex-1 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
                            >
                                Generate New Key
                            </button>
                            <button 
                                onClick={copy}
                                className="flex-1 rounded-2xl bg-brand-500 text-white px-6 py-4 text-sm font-bold shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                            >
                                Copy to .env
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                 Quick Guide
                            </h4>
                            <ul className="text-[11px] text-gray-500 dark:text-gray-400 space-y-2 font-medium">
                                <li className="flex gap-2">
                                    <span className="text-brand-500 font-bold">1.</span>
                                    <div>Copy the generated key above.</div>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-brand-500 font-bold">2.</span>
                                    <div>Open your <code>.env</code> file in your Laravel project root.</div>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-brand-500 font-bold">3.</span>
                                    <div>Update the <code>APP_KEY=</code> variable with this key.</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
