"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import useSWR from 'swr';
import axios from '@/lib/axios';

type Locale = 'en' | 'id';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const { data: user } = useSWR('/api/user', (url) => axios.get(url).then(res => res.data));
    const [locale, setLocaleState] = useState<Locale>('en');
    const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from localStorage or User data
    useEffect(() => {
        const savedLocale = localStorage.getItem('NEXT_LOCALE') as Locale;
        const initialLocale = user?.language || savedLocale || 'en';
        setLocaleState(initialLocale as Locale);
    }, [user?.language]);

    // Load messages when locale changes
    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            try {
                const msgs = (await import(`@/messages/${locale}.json`)).default;
                setMessages(msgs);
                localStorage.setItem('NEXT_LOCALE', locale);
            } catch (error) {
                console.error('Failed to load messages', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [locale]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
    };

    if (!messages) return null; // Or a global loader

    return (
        <I18nContext.Provider value={{ locale, setLocale, isLoading }}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used within I18nProvider');
    return context;
};
