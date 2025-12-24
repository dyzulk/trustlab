"use client";

import React from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Calendar, Shield, User, MapPin, Phone } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import { getUserAvatar } from "@/lib/utils";
import Link from "next/link";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UserProfileClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { data: user, error, isLoading } = useSWR(id ? `/api/admin/users/${id}` : null, fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Not Found</h3>
        <p className="text-gray-500 mt-2">The user you are looking for does not exist or you do not have permission to view this profile.</p>
        <Link 
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
            <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => router.back()} 
                className="p-2.5 text-gray-500 hover:text-brand-500 transition-colors bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl shadow-theme-xs"
                aria-label="Go back"
            >
                <ArrowLeft size={18} />
            </button>
            <div className="flex-1 sm:hidden">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Profile</h2>
            </div>
        </div>
        <div className="flex-1 -mb-6">
             <PageBreadcrumb pageTitle="User Profile Preview" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Header Card */}
        <div className="md:col-span-3">
             <ComponentCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand-500/10 to-blue-500/10 dark:from-brand-500/20 dark:to-blue-500/20 z-0"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-16 px-4 pb-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-theme-lg overflow-hidden bg-white dark:bg-gray-800">
                             <Image
                                src={getUserAvatar(user)}
                                alt={`${user.first_name} ${user.last_name}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ${user.email_verified_at ? 'bg-green-500' : 'bg-gray-400'}`} title={user.email_verified_at ? 'Verified' : 'Unverified'}></span>
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {user.first_name} {user.last_name}
                        </h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                {user.role === 'admin' ? <Shield size={14} className="text-brand-500" /> : <User size={14} />}
                                <span className="capitalize">{user.role}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {user.city_state || user.country ? `${user.city_state || ''}${user.country ? ', ' + user.country : ''}` : 'Location unknown'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <a 
                            href={`mailto:${user.email}`}
                            className="px-4 py-2 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-theme-xs flex items-center gap-2"
                        >
                            <Mail size={16} /> Contact
                        </a>
                    </div>
                </div>
             </ComponentCard>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
            <ComponentCard title="Contact Information">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email Address</p>
                            <a href={`mailto:${user.email}`} className="text-sm font-medium text-brand-500 hover:underline break-all">{user.email}</a>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400">
                            <Phone size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone Details</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Member Since</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>

        {/* Bio / Details */}
        <div className="md:col-span-2 space-y-6">
            <ComponentCard title="About User">
                {user.bio ? (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {user.bio}
                    </p>
                ) : (
                    <p className="text-gray-400 italic">No biography provided.</p>
                )}
            </ComponentCard>
            
            <ComponentCard title="Additional Details">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Job Title</p>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">{user.job_title || 'N/A'}</p>
                    </div>
                    <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Company</p>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">{user.company || 'N/A'}</p>
                    </div>
                    <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Postal Code</p>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">{user.postal_code || 'N/A'}</p>
                    </div>
                    <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tax ID</p>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">{user.tax_id || 'N/A'}</p>
                    </div>
                 </div>
            </ComponentCard>
        </div>
      </div>
    </div>
  );
}
