'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, XCircle, Settings, ShieldCheck, MailWarning, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/button/Button';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

interface MailConfig {
  host: string;
  port: number;
  encryption: string;
  from: string;
}

interface Configs {
  smtp: MailConfig;
  support: MailConfig;
}

export default function SmtpTesterPage() {
  const router = useRouter();
  const { user } = useAuth({ middleware: 'auth' });
  const { addToast } = useToast();
  const [configs, setConfigs] = useState<Configs | null>(null);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState<string | null>(null); // 'smtp' or 'support'
  const [testEmail, setTestEmail] = useState('');
  const [results, setResults] = useState<{ [key: string]: { success: boolean; message: string } }>({});

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard/settings');
      return;
    }
    fetchConfigs();
  }, [user, router]);

  const fetchConfigs = async () => {
    try {
      const response = await axios.get('/api/admin/smtp/config');
      setConfigs(response.data);
    } catch (error) {
      addToast('Failed to fetch SMTP configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const runTest = async (mailer: 'smtp' | 'support') => {
    if (!testEmail) {
      addToast('Please enter a recipient email address', 'error');
      return;
    }

    setTestLoading(mailer);
    setResults(prev => ({ ...prev, [mailer]: undefined as any }));

    try {
      const response = await axios.post('/api/admin/smtp/test', {
        email: testEmail,
        mailer
      });

      setResults(prev => ({
        ...prev,
        [mailer]: { success: true, message: response.data.message }
      }));
      addToast(`Success! Email sent via ${mailer}`, 'success');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Connection failed';
      setResults(prev => ({
        ...prev,
        [mailer]: { success: false, message }
      }));
      addToast(`Error: ${message}`, 'error');
    } finally {
      setTestLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <PageBreadcrumb pageTitle="SMTP Tester" />
      
      <div className="mb-6">
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Test your outgoing email configurations and connectivity across multiple mailers.
        </p>
      </div>

      {/* Recipient Input */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Recipient Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email to receive test message"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mailer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['smtp', 'support'] as const).map((mailer) => (
          <div 
            key={mailer}
            className="flex flex-col p-6 bg-white rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${mailer === 'smtp' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10'}`}>
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white capitalize">{mailer} Mailer</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Outgoing Settings</p>
                </div>
              </div>
              {results[mailer] && (
                results[mailer].success ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full">
                    <XCircle className="w-3.5 h-3.5" />
                    Failed
                  </div>
                )
              )}
            </div>

            <div className="flex-1 space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Host</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{configs?.[mailer].host || 'Not set'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Port / Security</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {configs?.[mailer].port} / <span className="uppercase">{configs?.[mailer].encryption}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">From Address</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{configs?.[mailer].from || 'Not set'}</p>
              </div>

              {results[mailer] && !results[mailer].success && (
                <div className="p-3 bg-rose-50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/20">
                  <div className="flex gap-2">
                    <MailWarning className="w-4 h-4 text-rose-500 shrink-0" />
                    <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
                      {results[mailer].message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => runTest(mailer)}
              isLoading={testLoading === mailer}
              className="w-full justify-center"
              variant={results[mailer]?.success ? 'success' : 'primary'}
              startIcon={<Send className="w-4 h-4" />}
            >
              Send Test Email
            </Button>
          </div>
        ))}
      </div>

      {/* Information Card */}
      <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 dark:bg-blue-500/5 dark:border-blue-500/20">
        <div className="flex gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl dark:bg-blue-500/20 text-blue-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-200">System Information</h4>
            <p className="text-sm text-blue-800/70 dark:text-blue-300/60 mt-1 leading-relaxed">
              These tests confirm that the server can establish a secure connection to your SMTP host. 
              If you aren't receiving emails despite a "Passed" result, please check your spam folder or 
              sender reputation settings on your mail server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
