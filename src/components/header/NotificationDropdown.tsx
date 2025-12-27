"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "@/lib/axios";
import { Bell, Check, Info, AlertTriangle, X } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useRouter } from "next/navigation";
import { getUserAvatar } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  data: {
    message: string;
    url?: string;
    certificate_id?: number;
    common_name?: string;
    days_remaining?: number;
    title?: string;
    sender_name?: string;
    sender_avatar?: string;
  };
  read_at: string | null;
  created_at: string;
}

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Optional: Set interval for polling or use Laravel Echo
    const interval = setInterval(fetchNotifications, 60000); // Pulse every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      const fetchedNotifications = response.data.data || [];
      setNotifications(fetchedNotifications);
      const unreadCount = fetchedNotifications.filter((n: Notification) => !n.read_at).length;
      setNotifying(unreadCount > 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
        // Refetch when opening to be fresh
        fetchNotifications();
    }
  };

  const closeDropdown = () => setIsOpen(false);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      const unreadCount = notifications.filter(n => !n.read_at && n.id !== id).length;
      setNotifying(unreadCount > 0);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
        await markAsRead(notification.id);
    }
    closeDropdown();
    
    // Support navigation if a URL is provided in the data
    const url = notification.data.url;
    if (url) {
        router.push(url);
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setNotifying(false);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
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
        return <AlertTriangle size={18} className="text-orange-500" />;
    }
    if (type.includes('Success')) {
        return <Check size={18} className="text-green-500" />;
    }
    return <Info size={18} className="text-blue-500" />;
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-brand-500 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-brand-500 rounded-full opacity-75 animate-ping"></span>
        </span>
        <Bell size={20} className="fill-current" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <button
            onClick={closeDropdown}
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar flex-grow">
          {notifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-3 bg-gray-100 rounded-full dark:bg-gray-800">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">We'll notify you when something happens.</p>
            </li>
          ) : (
            notifications.map((notification) => {
              const isTicket = notification.type.includes('Ticket');
              const hasSender = notification.data.sender_name || notification.data.sender_avatar;

              return (
                <li key={notification.id}>
                  <DropdownItem
                    onItemClick={() => handleNotificationClick(notification)}
                    className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 transition-colors ${!notification.read_at ? 'bg-brand-50/30 dark:bg-brand-500/5' : ''}`}
                  >
                    <div className="shrink-0">
                      {isTicket && hasSender ? (
                        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
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
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${!notification.read_at ? 'bg-white dark:bg-gray-900 border border-brand-100 dark:border-brand-900/50' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="block text-sm">
                        <span className={`text-gray-800 dark:text-white/90 leading-snug ${!notification.read_at ? 'font-semibold' : 'font-normal'}`}>
                          {notification.data.title || (isTicket ? 'Support Event' : (notification.type.includes('Certificate') ? 'Certificate Event' : 'System Update'))}
                        </span>
                      </span>
                      {notification.data.message && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                          {notification.data.message}
                        </span>
                      )}
                      <span className="flex items-center gap-2 mt-1.5 text-gray-400 text-[10px] uppercase font-medium tracking-wider">
                        <span>{notification.type.split('\\').pop()?.replace('Notification', '') || 'System'}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span>{getRelativeTime(notification.created_at)}</span>
                      </span>
                    </div>
                  </DropdownItem>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            {notifications.length > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex-1 px-4 py-2 text-xs font-medium text-center text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Mark all as read
                </button>
            )}
            <Link
              href="/dashboard/notifications"
              className="flex-1 px-4 py-2 text-xs font-medium text-center text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 transition-colors"
              onClick={closeDropdown}
            >
              View All
            </Link>
        </div>
      </Dropdown>
    </div>
  );
}

