import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import './globals.css';
import { Metadata } from 'next';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui/toast/Toast';
import { I18nProvider } from '@/components/providers/I18nProvider';


export const metadata: Metadata = {
  title: {
    template: '%s | TrustLab - PKI & Certificate Management',
    default: 'TrustLab - PKI & Certificate Management',
  },
  description: 'Advanced Certificate Authority and PKI Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased dark:bg-gray-900`}>
        <ThemeProvider>
          <I18nProvider>
            <ToastProvider>
              <SidebarProvider>{children}</SidebarProvider>
              <ToastContainer />
            </ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
