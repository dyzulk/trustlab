"use client";

import React, { useState } from "react";
import Link from "next/link";
import CommonGridShape from "@/components/common/CommonGridShape";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    // Simulate API call or call actual endpoint (which might fail if not implemented)
    // For now, we'll show a message or try calling the standard Laravel route if it existed
    try {
        // await axios.post('/forgot-password', { email });
        // setMessage("We have emailed your password reset link.");
        
        // Placeholder behavior until backend is ready
        setTimeout(() => {
            setError("Password reset is currently disabled. Please contact support.");
            setIsLoading(false);
        }, 1000);
    } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred.");
        setIsLoading(false);
    }
  };

  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900 flex-grow flex">
      {/* Form Section */}
      <div className="flex w-full flex-1 flex-col lg:w-1/2 justify-center">
        <div className="mx-auto w-full max-w-md pt-5 sm:py-10 px-4 sm:px-0">
             <div className="mb-5 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                    Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
             </div>

             <form onSubmit={submitForm}>
                <div className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                             Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            className="dark:bg-gray-900 shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
                            required
                        />
                    </div>

                    {message && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{message}</div>}
                    {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-brand-500 shadow-md hover:bg-brand-600 w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
                    >
                        {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                    
                    <div className="text-center">
                        <Link href="/signin" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
      </div>

       {/* Right Side Branding & Background */}
       <div className="relative hidden w-full items-center justify-center lg:flex lg:w-1/2 overflow-hidden bg-brand-950 dark:bg-gray-900/50">
             <CommonGridShape />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
             
             <div className="relative z-10 flex flex-col items-center max-w-sm px-8 text-center">
                 <Link href="/" className="mb-8 block transition-transform hover:scale-105 active:scale-95">
                    <img src="/images/logo/auth-logo.svg" alt="TrustLab Logo" className="h-16 w-auto" />
                 </Link>
                 <div className="space-y-4">
                     <h2 className="text-2xl font-bold text-white mb-2">
                         Account Recovery
                     </h2>
                     <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
                         Don't worry, happens to the best of us. We'll get you back into your account in no time.
                     </p>
                 </div>
             </div>
       </div>
    </div>
  );
}
