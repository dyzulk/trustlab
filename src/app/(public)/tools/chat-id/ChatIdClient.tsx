"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Chat {
  id: number;
  name: string;
  username: string;
  type: string;
}

export default function ChatIdClient() {
  const [botToken, setBotToken] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Load darkMode preference if needed, but for now relying on system/tailwind
  
  const findChats = async () => {
    if (!botToken) {
      setError("Please enter a Bot Token");
      return;
    }

    setLoading(true);
    setError("");
    setChats([]);

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
      const data = await response.json();

      if (!data.ok) {
        setError(data.description || "Invalid token or API error");
        return;
      }

      if (data.result.length === 0) {
        setError("No recent messages found. Please send a message to your bot first!");
        return;
      }

      const uniqueChats: Record<number, Chat> = {};
      data.result.forEach((update: any) => {
        const message = update.message || update.edited_message || update.channel_post || update.edited_channel_post || update.callback_query?.message;
        if (message && message.chat) {
          uniqueChats[message.chat.id] = {
            id: message.chat.id,
            name: message.chat.title || message.chat.first_name || "Group/Channel",
            username: message.chat.username ? `@${message.chat.username}` : "N/A",
            type: message.chat.type,
          };
        }
      });

      const chatList = Object.values(uniqueChats);
      setChats(chatList);

      if (chatList.length === 0) {
        setError("Could not find any chat information in recent updates.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pt-32 pb-20 px-4 relative z-10 flex-grow flex flex-col">
      <div className="max-w-2xl mx-auto space-y-12 relative z-10 w-full">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            💬 Telegram Utility
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Chat ID Finder
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Enter your <strong>Bot Token</strong> from @BotFather to see recent activity and find your <code>CHAT_ID</code>.
          </p>
        </div>

        <div className="bg-white px-8 py-10 shadow-2xl rounded-[2.5rem] dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Telegram Bot Token</label>
              <div className="relative">
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && findChats()}
                  placeholder="123456789:ABCDE..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-32"
                />
                <button
                  onClick={findChats}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Get Updates"
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex gap-3 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {chats.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">Detected Chat IDs:</h3>
                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">ID</th>
                        <th className="px-4 py-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {chats.map((chat) => (
                        <tr key={chat.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-800 dark:text-white">{chat.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{chat.username}</div>
                          </td>
                          <td className="px-4 py-4 font-mono text-blue-600 dark:text-blue-400">{chat.id}</td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => copyToClipboard(chat.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all"
                              title="Copy ID"
                            >
                              {copiedId === chat.id ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-xs font-bold text-gray-800 dark:text-white mb-2 uppercase tracking-tight">Instructions:</h3>
              <ol className="text-xs text-gray-500 dark:text-gray-400 space-y-2 list-decimal ml-4">
                <li>Send a random message (e.g., "Hello") to your Telegram Bot.</li>
                <li>Paste your <strong>Bot Token</strong> above and click <strong>Get Updates</strong>.</li>
                <li>Your <code>CHAT_ID</code> will appear in the table. Copy it for your configuration.</li>
              </ol>
            </div>
            
             <div className="pt-4 text-center">
                 <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                     ← Return Home
                 </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
