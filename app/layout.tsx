import { Suspense } from 'react';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';

import { QueryProvider } from '@/query/query-provider';

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

// Loading component for better UX
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <div className="w-32 h-32 bg-gradient-to-r from-xuedao_blue to-xuedao_pink rounded-full"></div>
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
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </QueryProvider>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html>
  );
}
