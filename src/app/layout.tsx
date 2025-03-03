import React, { Suspense } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import AuthProvider from "./auth/AuthProvider";
import StoreProvider from "@/redux/storeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenCV Kundali",
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Suspense>
        <AuthProvider>
          <ToastProvider>
            <StoreProvider>
              <body className={`${inter.className} min-h-screen`}>
                {children}
                <Toaster />
              </body>
            </StoreProvider>
          </ToastProvider>
        </ AuthProvider>
      </Suspense>
    </html>
  );
}
