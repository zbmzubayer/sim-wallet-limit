import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/providers/query-client-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sim Wallet Limit",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${geistMono.variable} antialiased`}>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
