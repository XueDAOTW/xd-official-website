import { Suspense } from 'react';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';

import { QueryProvider } from '@/query/query-provider';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { Toaster } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "XueDAO - Student Developer Community",
    template: "%s | XueDAO"
  },
  description: "XueDAO is the first community in Taiwan focused on Student Developers led by Students. Join us to build the future of blockchain technology.",
  keywords: ["XueDAO", "blockchain", "students", "developers", "Taiwan", "DAO", "web3", "community"],
  authors: [{ name: "XueDAO Team" }],
  creator: "XueDAO",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xuedao.org",
    title: "XueDAO - Student Developer Community",
    description: "XueDAO is the first community in Taiwan focused on Student Developers led by Students.",
    siteName: "XueDAO",
  },
  twitter: {
    card: "summary_large_image",
    title: "XueDAO - Student Developer Community",
    description: "XueDAO is the first community in Taiwan focused on Student Developers led by Students.",
    creator: "@xuedao_tw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon-32x32.png",
  },
};

// Enhanced loading component with skeleton loading
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-hero to-vision">
      {/* Skeleton Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-high-contrast shadow-medium">
        <Skeleton className="h-10 w-16 rounded" />
        <div className="ml-auto flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-7 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Skeleton Content */}
      <div className="pt-16 container px-4 md:px-6 space-y-12">
        {/* Hero Section Skeleton */}
        <div className="text-center py-20">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ))}
        </div>
        
        {/* Member Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="text-center space-y-3">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <meta name="theme-color" content="#95b5dd" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${roboto.className} antialiased`}>
        <QueryProvider>
          <ToastProvider>
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </ToastProvider>
        </QueryProvider>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html>
  );
}
