"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "@/lib/axios";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";
import { 
  ShieldCheck, 
  History, 
  Link2, 
  AlertTriangle, 
  Mail,
  Smartphone,
  Globe,
  Monitor,
  Trash2,
  Lock,
  Bell,
  Palette,
  Send,
  Languages,
  Download,
  Key,
  ChevronRight,
  LogOut,
  DoorOpen
} from "lucide-react";

import Switch from "@/components/form/switch/Switch";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function SettingsClient() {
  const { data: user } = useSWR("/api/user", fetcher);
  const { data: loginHistory, isLoading: historyLoading } = useSWR("/api/profile/login-history", fetcher);
  const { data: sessions, isLoading: sessionsLoading } = useSWR("/api/profile/sessions", fetcher);
  const { data: apiKeys } = useSWR("/api/api-keys", fetcher);
  
  const { addToast } = useToast();
  const { isOpen, openModal, closeModal } = useModal();
  
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const savePreference = async (key: string, value: boolean) => {
    try {
        // Optimistic update could go here, but for simplicity we rely on SWR revalidation or just wait
        await axios.patch('/api/profile', {
            [key]: value
        });
        mutate("/api/user"); // Refresh user data to confirm sync
        addToast("Settings updated", "success");
    } catch (err) {
        addToast("Failed to update settings", "error");
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      addToast("New passwords do not match", "error");
      return;
    }

    setIsSavingPassword(true);
    try {
      await axios.put("/api/profile/password", passwordData);
      addToast("Password updated successfully", "success");
      setPasswordData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update password";
      addToast(message, "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const revokeSession = async (id: string) => {
    try {
      await axios.delete(`/api/profile/sessions/${id}`);
      mutate("/api/profile/sessions");
      addToast("Session revoked successfully", "success");
    } catch (err) {
      addToast("Failed to revoke session", "error");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await axios.delete("/api/profile");
      addToast("Account deleted successfully. Logging out...", "success");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (err) {
      addToast("Failed to delete account", "error");
    } finally {
      setIsDeletingAccount(false);
      closeModal();
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'ios':
      case 'android':
        return <Smartphone className="w-5 h-5 text-gray-500" />;
      case 'mac':
      case 'windows':
      case 'linux':
        return <Monitor className="w-5 h-5 text-gray-500" />;
      default:
        return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Verification & Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Email Verification
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {user?.email_verified_at ? (
                  <Badge color="success" size="sm" variant="light" startIcon={<ShieldCheck className="w-3.5 h-3.5" />}>
                    Verified
                  </Badge>
                ) : (
                  <Badge color="warning" size="sm" variant="light">
                    Not Verified
                  </Badge>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10">
              <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                API Keys Summary
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You have <span className="font-semibold text-gray-800 dark:text-white/90">{apiKeys?.length || 0}</span> active API keys.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security: Update Password */}
      <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Security & Password
        </h4>
        <form onSubmit={updatePassword} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="col-span-1 lg:col-span-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.password}
                onChange={(e) => handlePasswordChange("password", e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.password_confirmation}
                onChange={(e) => handlePasswordChange("password_confirmation", e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSavingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Active Sessions Management */}
      <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Active Sessions
        </h4>
        {sessionsLoading ? (
          <div className="py-10 text-center text-gray-500">Loading sessions...</div>
        ) : sessions?.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <Monitor className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {session.name || "Default Session"}
                      </p>
                      {session.is_current && (
                        <Badge color="success" size="sm" variant="light">
                          Current Device
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last active: {new Date(session.last_active * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!session.is_current && (
                  <button 
                    onClick={() => revokeSession(session.id)}
                    className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Logout from this device"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-xl dark:border-gray-800">
            No active sessions found.
          </div>
        )}
      </div>

      {/* Login History (Last 30 Days) */}
      <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Login Activity
          </h4>
          <Badge color="light" size="sm" variant="light">
            Last Month
          </Badge>
        </div>

        {historyLoading ? (
          <div className="py-10 text-center text-gray-500">Loading activity...</div>
        ) : loginHistory?.length > 0 ? (
          <div className="overflow-x-auto border border-gray-100 rounded-xl dark:border-gray-800">
            <table className="min-w-[600px] w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.02]">
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 w-[30%]">Browser/OS</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 w-[20%]">IP Address</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 w-[25%]">Location</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 w-[25%] text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loginHistory.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(item.device_type)}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.browser}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.os}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{item.ip_address}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {item.country_code && (
                          <div className="flex-shrink-0 w-5 h-3.5 overflow-hidden rounded-[2px] shadow-sm border border-gray-100 dark:border-gray-800">
                            <img 
                              src={`https://flagcdn.com/${item.country_code.toLowerCase()}.svg`}
                              alt={item.country}
                              className="block w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.city && item.country ? `${item.city}, ${item.country}` : "Unknown"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-xl dark:border-gray-800">
            No activity records in the last 30 days.
          </div>
        )}
      </div>

      {/* Advanced Security & UI Placeholders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 2FA Placeholder */}
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Lock className="w-5 h-5" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Two-Factor Auth (2FA)</h4>
            </div>
            <Badge color="primary" size="sm" variant="light">Coming Soon</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Secure your account with an authentication app like Google Authenticator.</p>
          <div className="mt-4">
            <Button variant="outline" size="sm" disabled className="w-full">Setup 2FA</Button>
          </div>
        </div>

        {/* Notifications Placeholder */}
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Bell className="w-5 h-5" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Notifications</h4>
            </div>
            {/* Badge Removed */}
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Alerts</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">Critical security events only</span>
                </div>
                <Switch 
                    label="" 
                    defaultChecked={!!user?.settings_email_alerts} 
                    onChange={(checked) => savePreference('settings_email_alerts', checked)} 
                    disabled={!user}
                />
             </div>
             <div className="flex items-center justify-between">
                <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Certificate Renewal</span>
                     <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bell {'<'}30d, Email {'<'}7d</span>
                </div>
                <Switch 
                    label="" 
                    defaultChecked={!!user?.settings_certificate_renewal} 
                    onChange={(checked) => savePreference('settings_certificate_renewal', checked)} 
                    disabled={!user}
                />
             </div>
          </div>
          {user?.role === 'admin' && (
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
               <Link href="/dashboard/admin/smtp-tester">
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                     <Send className="w-4 h-4" /> SMTP Connection Tester
                  </Button>
               </Link>
            </div>
          )}
        </div>

        {/* Display & Language Placeholder */}
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Palette className="w-5 h-5" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Appearance</h4>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className="p-3 border border-gray-100 rounded-xl dark:border-gray-800 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Globe className="w-4 h-4" /> <span className="text-xs">System Theme</span>
             </div>
             <div className="p-3 border border-gray-100 rounded-xl dark:border-gray-800 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Languages className="w-4 h-4" /> <span className="text-xs">English (US)</span>
             </div>
          </div>
        </div>

        {/* Export & Data Placeholder */}
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Download className="w-5 h-5" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Privacy & Data</h4>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Download a copy of your personal data in JSON format.</p>
          <Button variant="outline" size="sm" disabled className="w-full flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </div>

        {/* Landing Page Placeholder */}
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <DoorOpen className="w-5 h-5" />
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Default Landing Page</h4>
             </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl dark:border-gray-800 text-gray-500 dark:text-gray-400">
             <span className="text-sm">Current: Dashboard</span>
             <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Linked Accounts
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl dark:border-gray-800">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 border border-gray-100 rounded-full dark:border-gray-800">
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">Google Account</p>
                <div className="mt-1">
                  {user?.google_id ? (
                    <Badge color="success" size="sm" variant="light">Connected</Badge>
                  ) : (
                    <Badge color="light" size="sm" variant="light">Not connected</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              {user?.google_id ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl dark:border-gray-800">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 border border-gray-100 rounded-full dark:border-gray-800">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-800 dark:text-white" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">GitHub Account</p>
                <div className="mt-1">
                  {user?.github_id ? (
                    <Badge color="success" size="sm" variant="light">Connected</Badge>
                  ) : (
                    <Badge color="light" size="sm" variant="light">Not connected</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              {user?.github_id ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 border border-red-200 bg-red-50 rounded-2xl dark:border-red-500/15 dark:bg-red-500/5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm dark:bg-red-500/10">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danger Zone
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Permanently delete your account and all associated data. This action is irreversible.
            </p>
            <div className="mt-6">
              <Button variant="danger" onClick={openModal}>
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[450px] m-4">
        <div className="p-6 sm:p-8">
           <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-50 rounded-full dark:bg-red-500/10">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">Delete Account?</h3>
              <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
                Are you absolutely sure? This will delete your profile, certificates, API keys, and all other data. You cannot undo this.
              </p>
              <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" className="w-full sm:w-auto" onClick={closeModal} disabled={isDeletingAccount}>
                  Cancel, Keep it
                </Button>
                <Button variant="danger" className="w-full sm:w-auto" onClick={handleDeleteAccount} loading={isDeletingAccount}>
                  Yes, Delete My Account
                </Button>
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
}
