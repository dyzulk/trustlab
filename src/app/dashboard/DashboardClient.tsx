"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  Server,
  CheckCircle, 
  MessageSquare,
  Download,
  LogIn,
  UserPlus,
  Trash2,
  FilePlus
} from "lucide-react";
import echo from "@/lib/echo";
import PageLoader from "@/components/ui/PageLoader";
import Tooltip from "@/components/ui/Tooltip";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'login': return <LogIn className="w-4 h-4 text-blue-500" />;
    case 'register': return <UserPlus className="w-4 h-4 text-green-500" />;
    case 'issue_cert': return <FilePlus className="w-4 h-4 text-brand-500" />;
    case 'delete_cert': return <Trash2 className="w-4 h-4 text-red-500" />;
    case 'create_ticket': return <MessageSquare className="w-4 h-4 text-purple-500" />;
    case 'reply_ticket': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
    case 'close_ticket': return <CheckCircle className="w-4 h-4 text-gray-500" />;
    default: return <Activity className="w-4 h-4 text-gray-400" />;
  }
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function DashboardClient() {
  const t = useTranslations("Dashboard");
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard", fetcher, {
    refreshInterval: 0, // Disable auto polling, rely on WS or manual refresh
  });

  const router = useRouter();
  const { data: userData } = useSWR("/api/user", fetcher);
  const user = userData;

  useEffect(() => {
    if (user?.default_landing_page && user.default_landing_page !== '/dashboard') {
        router.push(user.default_landing_page);
    }
  }, [user, router]);
  
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [wsLatency, setWsLatency] = useState<string>("Unknown");

  const stats = data?.data?.stats;
  const activity = data?.data?.recent_activity;
  const chartData = data?.data?.chart_data;

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


  if (isLoading) return <PageLoader text="Loading Dashboard..." />;
  if (error) return <div className="p-6 text-red-500">Error loading dashboard data.</div>;

  // Chart Configuration
  const chartOptions: any = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "inherit",
      type: "area",
      height: 310,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 80, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: chartData?.map((d: any) => d.day) || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
        labels: {
            formatter: (val: number) => Math.floor(val)
        }
    },
    tooltip: {
      x: { format: "dd/MM/yy HH:mm" },
    },
  };

  const chartSeries = [
    {
      name: t("issued_certs"),
      data: chartData?.map((d: any) => d.count) || [],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t("overview")}</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">{t("metrics_health")}</p>
        </div>
        <div className="flex items-center gap-3">
             {/* System Health Indicators */}
            <Tooltip content={t("ws_tooltip")} position="top-end">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  wsStatus === 'connected' 
                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              }`}>
                  {wsStatus === 'connected' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                  <span>{t("ws_status")}: {wsStatus === 'connected' ? t("live") : t("offline")}</span>
              </div>
            </Tooltip>

            <Tooltip content={t("latency_tooltip")} position="top-end">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{t("api_status")}: {apiLatency !== null ? `${apiLatency}ms` : 'N/A'}</span>
              </div>
            </Tooltip>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Certificate Stats */}
        <StatsCard 
            title={t("total_certificates")} 
            value={stats?.total_certificates || 0} 
            icon={<FileText className="w-6 h-6 text-blue-500" />}
        />
        <StatsCard 
            title={t("active_certificates")} 
            value={stats?.active_certificates || 0} 
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
        />
        <StatsCard 
            title={t("expired")} 
            value={stats?.expired_certificates || 0} 
            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
            footer={stats?.expired_certificates?.value > 0 ? t("action_needed") : t("all_good")}
            alert={stats?.expired_certificates?.value > 0} 
        />
        <StatsCard 
            title={t("active_tickets")} 
            value={stats?.active_tickets || 0} 
            icon={<Users className="w-6 h-6 text-purple-500" />}
        />
      </div>

      {/* Admin Extra Stats (Conditional Render in real app, filtering here for demo) */}
      {stats?.total_users !== undefined && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
               <StatsCard 
                title={t("total_users")} 
                value={stats.total_users} 
                icon={<Users className="w-6 h-6 text-indigo-500" />}
               />
               <StatsCard 
                title={t("pending_inquiries")} 
                value={stats.pending_inquiries} 
                icon={<MessageSquare className="w-6 h-6 text-pink-500" />}
                alert={stats.pending_inquiries?.value > 0}
                footer={stats.pending_inquiries?.value > 0 ? t("response_required") : t("no_new_messages")}
               />
          </div>
      )}

      {/* CA Download Stats (Admin Only) */}
      {stats?.ca_downloads_root !== undefined && (
          <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("ca_downloads")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatsCard 
                    title={t("root_ca")} 
                    value={stats.ca_downloads_root} 
                    icon={<Download className="w-6 h-6 text-brand-500" />}
                    footer={t("global_trust_root")}
                  />
                  <StatsCard 
                    title={t("intermediate_2048")} 
                    value={stats.ca_downloads_intermediate_2048} 
                    icon={<Download className="w-6 h-6 text-blue-500" />}
                    footer={t("standard_issuance")}
                  />
                  <StatsCard 
                    title={t("intermediate_4096")} 
                    value={stats.ca_downloads_intermediate_4096} 
                    icon={<Download className="w-6 h-6 text-indigo-500" />}
                    footer={t("high_security")}
                  />
              </div>
          </div>
      )}

      {/* Log / Activity Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("recent_activity")}</h3>
                    <button className="text-sm text-brand-500 hover:underline">{t("view_all")}</button>
                </div>
                {activity && activity.length > 0 ? (
                    <div className="space-y-4">
                        {activity.map((item: any, i: number) => (
                             <div key={item.id || i} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center relative">
                                     {item.user_avatar ? (
                                         <img src={item.user_avatar} alt="" className="w-full h-full object-cover rounded-full" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <span className="text-xs font-bold text-gray-400">{item.user_name.charAt(0)}</span>
                                         </div>
                                     )}
                                     <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-theme-sm border border-gray-100 dark:border-gray-800">
                                         {getActivityIcon(item.action)}
                                     </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        <span className="text-brand-500 font-bold">{item.user_name}</span> {item.description || item.action}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {new Date(item.created_at).toLocaleString()}
                                    </p>
                                </div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Clock className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">{t("no_activity")}</p>
                    </div>
                )}
            </div>
            
            <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("certificate_trends")}</h3>
                    <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{t("last_7_days")}</span>
                    </div>
                </div>
                <div className="min-h-[250px] w-full">
                     <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="area"
                        height={250}
                    />
                </div>
            </div>
       </div>
    </div>
  );
}

// Subcomponents
function StatsCard({ title, value, icon, trend, trendLabel, footer, alert }: any) {
    const t = useTranslations("Dashboard");
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
                                {effectiveTrendLabel || t("vs_last_month")}
                            </span>
                         </>
                     )}
                 </div>
            )}
            
            {/* Fallback for cards with NO footer/trend to keep height consistent (optional, removed for now as not requested) */}
        </div>
    );
}
