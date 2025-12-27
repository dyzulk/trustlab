"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/axios";
import { useTranslations } from "next-intl";
import { LanguagesIcon } from "lucide-react";
import useSWR from "swr";

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const { user, mutate } = useAuth();
  
  const toggleLanguage = async () => {
    const newLocale = locale === "en" ? "id" : "en";
    try {
      // Update locally for instant feedback
      setLocale(newLocale);
      
      // Update backend for persistence if user is logged in
      if (user) {
        await axios.patch("/api/profile", {
          language: newLocale,
        });
        // Refresh user data
        mutate();
      }
    } catch (error) {
      console.error("Failed to update language preference", error);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:text-white"
      title={locale === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
    >
      <LanguagesIcon size={20} />
      <span className="absolute -bottom-1 -right-1 flex h-4 b-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[8px] font-bold text-white uppercase">
        {locale}
      </span>
    </button>
  );
};
