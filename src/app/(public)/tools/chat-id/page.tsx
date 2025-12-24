import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chat ID Finder",
  description: "A simple tool to find your Telegram Chat ID.",
};

export default function ChatIdFinder() {
    return (
        <div className="pt-32 pb-20 px-4 relative z-10 flex-grow flex flex-col">
            <div className="max-w-2xl mx-auto space-y-12 relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                        💬 Telegram Utility
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Chat ID Finder
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        This tool is currently under development. Please check back later.
                    </p>
                     <div className="pt-8">
                        <Link href="/" className="px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
