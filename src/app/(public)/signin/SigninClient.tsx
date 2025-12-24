"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import CommonGridShape from "@/components/common/CommonGridShape";
import { Eye, EyeOff } from "lucide-react";

export default function SigninClient() {
  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login({
        email,
        password,
        remember,
        setErrors,
    });
    setIsLoading(false);
  };

  const socialLogin = (provider: string) => {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/redirect?context=signin`;
  };

  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900 flex-grow flex">
      {/* Form Section */}
      <div className="flex w-full flex-1 flex-col lg:w-1/2 justify-center">
        <div className="mx-auto w-full max-w-md pt-5 sm:py-10 px-4 sm:px-0">
             <div className="mb-6 flex items-center justify-between">
                {/* Header elements removed as they are provided by Public Layout */}
             </div>

             <div className="mb-5 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                    Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email and password to sign in!
                </p>
             </div>

             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 mb-5">
                <button
                    onClick={() => socialLogin('google')}
                    className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
                         <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
                         <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
                         <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
                    </svg>
                    Sign in with Google
                </button>
                 <button
                    onClick={() => socialLogin('github')}
                    className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    Sign in with GitHub
                </button>
             </div>

            <div className="relative py-3 sm:py-5 mb-5">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white p-2 text-gray-400 sm:px-5 sm:py-2 dark:bg-gray-900">Or</span>
                </div>
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
                            placeholder='Email is "admin@trustlab.com"'
                            className="dark:bg-gray-900 shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                             Password<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password is "password"'
                                className="dark:bg-gray-900 shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                         <label className="flex cursor-pointer items-center text-sm font-normal text-gray-700 select-none dark:text-gray-400">
                            <input 
                                type="checkbox" 
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="mr-3 h-5 w-5 rounded-md border-gray-300 dark:border-gray-700 text-brand-500 focus:ring-brand-500" 
                            />
                            Keep me logged in
                         </label>
                         <Link href="/forgot-password" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm">
                            Forgot password?
                         </Link>
                    </div>

                    {/* <Turnstile className="mb-5" /> */}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-brand-500 shadow-md hover:bg-brand-600 w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <div className="mt-5">
                 <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                    Don't have an account? <Link href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Sign Up</Link>
                 </p>
                 <p className="mt-4 text-center text-xs text-gray-500 sm:text-start dark:text-gray-500">
                    By signing in, you agree to our <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">Terms</Link> and <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</Link>.
                 </p>
            </div>
        </div>
      </div>

       {/* Right Side Branding & Background */}
       <div className="relative hidden w-full items-center justify-center lg:flex lg:w-1/2 overflow-hidden bg-brand-950 dark:bg-gray-900/50">
             {/* Background Decoration */}
             <CommonGridShape />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
             
             {/* Branding Content */}
             <div className="relative z-10 flex flex-col items-center max-w-sm px-8 text-center">
                 <Link href="/" className="mb-8 block transition-transform hover:scale-105 active:scale-95">
                    <img src="/images/logo/auth-logo.svg" alt="TrustLab Logo" className="h-16 w-auto" />
                 </Link>
                 <div className="space-y-4">
                     <h2 className="text-2xl font-bold text-white mb-2">
                         Welcome to TrustLab
                     </h2>
                     <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
                         Professional Certificate Authority & API Management System. 
                         Secure, reliable, and built for modern developers.
                     </p>
                 </div>
                 
                 {/* Decorative element */}
                 <div className="mt-12 flex gap-3">
                     <div className="h-1.5 w-12 rounded-full bg-brand-500"></div>
                     <div className="h-1.5 w-4 rounded-full bg-brand-500/30"></div>
                     <div className="h-1.5 w-4 rounded-full bg-brand-500/30"></div>
                 </div>
             </div>
       </div>
    </div>
  );
}
