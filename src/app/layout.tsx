import "./globals.css";

import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "File Management System",
    template: "%s | File Management System",
  },
  description: "Secure and efficient file management solution for modern SaaS applications.",
  keywords: ["file management", "storage", "cloud", "saas", "dashboard"],
  authors: [{ name: "Your Name/Company" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "File Management System",
    description: "Secure and efficient file management solution for modern SaaS applications.",
    siteName: "File Management System",
  },
  twitter: {
    card: "summary_large_image",
    title: "File Management System",
    description: "Secure and efficient file management solution for modern SaaS applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
