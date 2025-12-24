import { Outfit } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui/toast/Toast';


export const metadata: Metadata = {
  title: {
    template: '%s | TrustLab - PKI & Certificate Management',
    default: 'TrustLab - PKI & Certificate Management',
  },
  description: 'Advanced Certificate Authority and PKI Management System',
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <ToastProvider>
            <SidebarProvider>{children}</SidebarProvider>
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
