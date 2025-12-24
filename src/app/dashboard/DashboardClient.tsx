"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { 
  BarChart3, 
  Users, 
  FileText, 
  AlertCircle, 
  Activity, 
  Clock, 
  Wifi, 
  WifiOff, 
  Server
} from "lucide-react";
import echo from "@/lib/echo";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function DashboardClient() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard", fetcher, {
    refreshInterval: 0, // Disable auto polling, rely on WS or manual refresh
  });
  
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [wsLatency, setWsLatency] = useState<string>("Unknown");

  const stats = data?.data?.stats;
  const activity = data?.data?.recent_activity;

  // Realtime & Latency Logic
  useEffect(() => {
    if (!echo) return;

    // WebSocket Status
    if (echo.connector.pusher.connection.state === 'connected') {
        setWsStatus('connected');
    }

    echo.connector.pusher.connection.bind('connected', () => {
      setWsStatus('connected');
      setWsLatency("Active"); 
    });
    
    echo.connector.pusher.connection.bind('disconnected', () => {
      setWsStatus('disconnected');
    });

    echo.connector.pusher.connection.bind('connecting', () => {
      setWsStatus('connecting');
    });

    // Listen for global dashboard updates if implemented
    // echo.channel('dashboard').listen('.DashboardUpdated', () => { mutate(); });

    return () => {
       // cleanup if needed
    };
  }, []);

  // API Latency Check
  const checkApiLatency = async () => {
    const start = performance.now();
    try {
      await axios.get('/api/dashboard/ping');
      const end = performance.now();
      setApiLatency(Math.round(end - start));
    } catch (e) {
      setApiLatency(null);
    }
  };

  useEffect(() => {
    checkApiLatency();
    const interval = setInterval(checkApiLatency, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);


  if (isLoading) return <div className="p-6">Loading Dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading dashboard data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Overview</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">Real-time metrics & system health</p>
        </div>
        <div className="flex items-center gap-3">
             {/* System Health Indicators */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                wsStatus === 'connected' 
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
            }`}>
                {wsStatus === 'connected' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>WS: {wsStatus === 'connected' ? 'Live' : 'Offline'}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                <Activity className="w-3.5 h-3.5" />
                <span>API: {apiLatency !== null ? `${apiLatency}ms` : 'N/A'}</span>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Certificate Stats */}
        <StatsCard 
            title="Total Certificates" 
            value={stats?.total_certificates || 0} 
            icon={<FileText className="w-6 h-6 text-blue-500" />}
        />
        <StatsCard 
            title="Active Certificates" 
            value={stats?.active_certificates || 0} 
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
        />
        <StatsCard 
            title="Expired" 
            value={stats?.expired_certificates || 0} 
            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
            footer={stats?.expired_certificates?.value > 0 ? "Action Needed" : "All Good"}
            alert={stats?.expired_certificates?.value > 0} 
        />
        <StatsCard 
            title="Active Tickets" 
            value={stats?.active_tickets || 0} 
            icon={<Users className="w-6 h-6 text-purple-500" />}
        />
      </div>

      {/* Admin Extra Stats (Conditional Render in real app, filtering here for demo) */}
      {stats?.total_users !== undefined && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
               <StatsCard 
                title="Total Users" 
                value={stats.total_users} 
                icon={<Users className="w-6 h-6 text-indigo-500" />}
               />
               <StatsCard 
                title="Pending Inquiries" 
                value={stats.pending_inquiries} 
                icon={<MessageSquare className="w-6 h-6 text-pink-500" />}
                alert={stats.pending_inquiries?.value > 0}
                footer={stats.pending_inquiries?.value > 0 ? "Response Required" : "No new messages"}
               />
          </div>
      )}

      {/* Log / Activity Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
                    <button className="text-sm text-brand-500 hover:underline">View All</button>
                </div>
                {activity && activity.length > 0 ? (
                    <ul className="space-y-3">
                        {activity.map((item: any, i: number) => (
                             <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>User {item.name} registered.</span>
                                <span className="ml-auto text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                             </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Clock className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No recent activity recorded.</p>
                    </div>
                )}
            </div>
            
            {/* Placeholder for Chart or other widget */}
            <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 shadow-sm flex items-center justify-center min-h-[200px]">
                 <p className="text-gray-400 text-sm">Traffic Chart Placeholder</p> 
            </div>
       </div>
    </div>
  );
}

// Subcomponents
function StatsCard({ title, value, icon, trend, trendLabel, footer, alert }: any) {
    const isPositive = typeof trend === 'number' ? trend >= 0 : false;
    const trendValue = typeof trend === 'number' ? `${isPositive ? '+' : ''}${trend}%` : trend;
    
    // Determine the value to display
    const displayValue = typeof value === 'object' ? value.value : value;
    
    // Determine trend data from value object or props
    const effectiveTrend = value?.trend !== undefined ? value.trend : trend;
    const effectiveTrendLabel = value?.trend_label !== undefined ? value.trend_label : trendLabel;

    return (
        <div className={`p-5 bg-white border rounded-2xl dark:bg-gray-900 shadow-sm transition-all hover:shadow-md ${alert ? 'border-red-200 dark:border-red-900/30' : 'border-gray-200 dark:border-gray-800'}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{displayValue}</h4>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${alert ? 'bg-red-50 text-red-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    {icon}
                </div>
            </div>
            
            {/* Dynamic Bottom Section - Standardized Layout */}
            {(effectiveTrend !== undefined || footer) && (
                 <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${
                    footer ? (alert ? 'text-red-500' : 'text-gray-500') :
                    (isPositive && effectiveTrend >= 0) ? 'text-green-500' : 'text-red-500'
                 }`}>
                     {footer ? (
                         // Custom Footer (replaces trend)
                         <span>{footer}</span>
                     ) : (
                         // Standard Trend
                         <>
                            <span>
                                {typeof effectiveTrend === 'number' && effectiveTrend > 0 ? '+' : ''}
                                {effectiveTrend}%
                            </span>
                            <span className="text-gray-400">
                                {effectiveTrendLabel || "vs last month"}
                            </span>
                         </>
                     )}
                 </div>
            )}
            
            {/* Fallback for cards with NO footer/trend to keep height consistent (optional, removed for now as not requested) */}
        </div>
    );
}

// Icons needed for this file
import { CheckCircle, MessageSquare } from "lucide-react";
