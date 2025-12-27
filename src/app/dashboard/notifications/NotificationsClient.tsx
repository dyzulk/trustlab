"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Bell, Check, Info, AlertTriangle, Search, Filter, Trash2, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import { getUserAvatar } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  data: {
    message: string;
    url?: string;
    title?: string;
    sender_name?: string;
    sender_avatar?: string;
  };
  read_at: string | null;
  created_at: string;
}

export default function NotificationsClient() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchNotifications();
  }, [pagination.current_page, filter, debouncedSearch]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/notifications", {
        params: {
          page: pagination.current_page,
          filter: filter !== 'all' ? filter : undefined,
          search: debouncedSearch || undefined
        }
      });
      setNotifications(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await axios.post('/api/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id: string) => {
      // Assuming a delete endpoint exists or will be added
      try {
          await axios.delete(`/api/notifications/${id}`);
          setNotifications(notifications.filter(n => n.id !== id));
      } catch (error) {
          console.error("Failed to delete notification:", error);
      }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
        await markAsRead(notification.id);
    }
    
    const url = notification.data.url;
    if (url) {
        router.push(url);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    if (type.includes('Expiry') || type.includes('Urgent')) {
        return <AlertTriangle size={20} className="text-orange-500" />;
    }
    if (type.includes('Success')) {
        return <Check size={20} className="text-green-500" />;
    }
    return <Info size={20} className="text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your recent activity notifications.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={markAllAsRead}
                disabled={markingAll || notifications.every(n => n.read_at)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg h-10 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
                <CheckCircle size={18} />
                Mark all as read
            </button>
        </div>
      </div>

      <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search notifications..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${filter === 'unread' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    Unread
                </button>
                <button 
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${filter === 'read' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    Read
                </button>
            </div>
        </div>

        {loading ? (
            <div className="py-20 flex justify-center">
                <PageLoader text="Loading notifications..." />
            </div>
        ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 mb-4 bg-gray-50 rounded-full flex items-center justify-center dark:bg-gray-800 text-gray-300 dark:text-gray-600">
                    <Bell size={32} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">No notifications found</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                    {debouncedSearch ? `No results for "${debouncedSearch}". Try a different search term.` : "You don't have any notifications yet."}
                </p>
            </div>
        ) : (
            <div className="space-y-1">
                {notifications.map((notification) => {
                    const isTicket = notification.type.includes('Ticket');
                    const hasSender = notification.data.sender_name || notification.data.sender_avatar;

                    return (
                        <div 
                            key={notification.id}
                            className={`group flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                !notification.read_at 
                                ? 'bg-brand-50/20 border-brand-100 dark:bg-brand-500/5 dark:border-brand-900/30' 
                                : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50/50 dark:bg-transparent dark:hover:bg-white/5 dark:hover:border-gray-800'
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="shrink-0 pt-0.5">
                                {isTicket && hasSender ? (
                                    <div className="relative w-12 h-12 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                                        <Image
                                            src={getUserAvatar({
                                                avatar: notification.data.sender_avatar,
                                                name: notification.data.sender_name
                                            })}
                                            alt={notification.data.sender_name || "User"}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${!notification.read_at ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col">
                                        <h5 className={`text-base leading-tight text-gray-900 dark:text-white ${!notification.read_at ? 'font-bold' : 'font-semibold'}`}>
                                            {notification.data.title || (isTicket ? 'Support Event' : (notification.type.includes('Certificate') ? 'Certificate Event' : 'System Update'))}
                                        </h5>
                                        <p className="text-xs text-gray-400 font-medium mt-1">
                                            {notification.type.split('\\').pop()?.replace('Notification', '')} • {getRelativeTime(notification.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read_at && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                    {notification.data.message}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {pagination.last_page > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} notifications)
                </p>
                <div className="flex items-center gap-2">
                    <button 
                        disabled={pagination.current_page === 1}
                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                        className="p-2 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 dark:bg-gray-900 dark:border-gray-800 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                        className="p-2 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 dark:bg-gray-900 dark:border-gray-800 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
