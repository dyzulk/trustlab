"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CommonGridShape from "@/components/common/CommonGridShape";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    const action = searchParams.get("action");

    if (errorParam) {
        if (errorParam === 'account_exists_please_login') {
            setError("This email is already associated with an account. Please sign in with your password and link your social account in settings.");
        } else if (errorParam === 'account_not_found_please_signup') {
            setError("Account not found. Please Sign Up to create a new account.");
        } else if (errorParam === 'authentication_failed') {
            setError("Authentication failed. Please try again.");
        } else {
            setError("An unknown error occurred during authentication.");
        }
        setStatus("");
        return;
    }

    if (token) {
        if (action === "set_password") {
            router.push("/auth/set-password?token=" + token);
        } else {
            router.push("/dashboard");
        }
    } else {
        const timeout = setTimeout(() => {
             setError("No response from server.");
             setStatus("");
        }, 5000);
        return () => clearTimeout(timeout);
    }
  }, [searchParams, router]);

  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900 flex-grow flex items-center justify-center min-h-screen">
       <div className="relative z-10 w-full max-w-md p-8 text-center">
            {error ? (
                <div className="space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authentication Error</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
                    </div>
                    <Link
                        href="/signin"
                        className="inline-flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                        Back to Sign In
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/20">
                          <svg className="animate-spin h-8 w-8 text-brand-600 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                     </div>
                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">{status}</h2>
                </div>
            )}
       </div>
       
       {/* Background */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <CommonGridShape />
       </div>
    </div>
  );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
