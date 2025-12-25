"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { getUserAvatar } from "@/lib/utils";
import { X, MessageSquare, Bell, Info, CheckCircle2 } from "lucide-react";
import echo from "@/lib/echo";
import { useAuth } from "@/hooks/useAuth";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { data, mutate, isLoading } = useSWR("/api/notifications", fetcher);

  // Realtime Listener
  useEffect(() => {
    if (user?.id && echo) {
        const channel = echo.private(`App.Models.User.${user.id}`);
        
        channel.notification((notification: any) => {
            mutate(); // Revalidate SWR
            // Optional: Show toast or play sound
        });

        return () => {
             echo?.leave(`App.Models.User.${user.id}`);
        };
    }
  }, [user?.id, mutate]);

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      mutate();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post("/api/notifications/mark-all-read");
      mutate();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/notifications/${id}`);
      mutate();
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <MessageSquare className="w-4 h-4" />;
      case 'system':
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700 px-2">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notification
            </h5>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-brand-500 rounded-lg">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors"
                title="Mark all as read"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={toggleDropdown}
              className="p-1.5 text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar flex-grow">
          {isLoading ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((n: any) => (
              <li key={n.id}>
                <DropdownItem
                  tag="a"
                  onItemClick={() => {
                    if (!n.read_at) markAsRead(n.id);
                    closeDropdown();
                  }}
                  href={n.data.url || "#"}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 relative group ${!n.read_at ? 'bg-brand-50/30 dark:bg-brand-500/5' : ''}`}
                >
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <Image
                      width={40}
                      height={40}
                      src={getUserAvatar({ name: n.data.name || "System" })}
                      alt="User"
                      className="w-full overflow-hidden rounded-full"
                      unoptimized={true}
                    />
                    {!n.read_at && (
                      <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-brand-500 dark:border-gray-900"></span>
                    )}
                  </span>

                  <span className="block flex-grow overflow-hidden">
                    <span className="mb-1 block text-theme-sm text-gray-500 dark:text-gray-400 leading-snug">
                       <span className={`dark:text-white/90 ${!n.read_at ? 'font-bold text-gray-900' : 'text-gray-800 font-medium'}`}>
                        {n.data.message}
                      </span>
                    </span>

                    <span className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">
                      <span className="flex items-center gap-1">
                        {getNotificationIcon(n.data.type)}
                        {n.data.type || 'system'}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                      <span>{formatTime(n.created_at)}</span>
                    </span>
                  </span>

                  <button
                    onClick={(e) => deleteNotification(e, n.id)}
                    className="absolute right-2 top-3 p-1 text-gray-300 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </DropdownItem>
              </li>
            ))
          ) : (
            <div className="py-20 text-center px-4">
              <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No notifications yet</p>
              <p className="text-xs text-gray-500 mt-1">We'll notify you when something important happens.</p>
            </div>
          )}
        </ul>

        {notifications.length > 0 && (
          <Link
            href="/dashboard/notifications"
            className="block px-4 py-3 mt-3 text-xs font-bold text-center text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors uppercase tracking-widest"
            onClick={closeDropdown}
          >
            View All Notifications
          </Link>
        )}
      </Dropdown>
    </div>
  );
}
