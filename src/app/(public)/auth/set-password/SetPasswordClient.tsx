"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CommonGridShape from "@/components/common/CommonGridShape";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

export default function SetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // If token is present in URL (passed from callback), we might need to use it
  // But usually, the session cookie is already set by the backend login.
  // The token query param is mostly for stateless clients, but we can store it if needed.
  // Ideally, Sanctum uses cookies.

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
        await axios.post("/api/auth/set-password", {
            password,
            password_confirmation: passwordConfirmation,
        });
        
        // Success
        router.push("/dashboard?success=password_set");
    } catch (error: any) {
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors);
        } else {
            setErrors({ general: "Something went wrong. Please try again." });
        }
    } finally {
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
                    Set Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Since you signed up via social login, please set a password for your account security.
                </p>
             </div>

            <form onSubmit={submitForm}>
                <div className="space-y-5">
                    {errors.general && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/10 mb-4">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                             New Password<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                             Confirm Password<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="dark:bg-gray-900 shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-brand-500 shadow-md hover:bg-brand-600 w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
                    >
                        {isLoading ? 'Setting Password...' : 'Set Password & Continue'}
                    </button>
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
                         Secure Your Account
                     </h2>
                     <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
                         Setting a password ensures you can always access your account, even if you lose access to your social login.
                     </p>
                 </div>
             </div>
       </div>
    </div>
  );
}
