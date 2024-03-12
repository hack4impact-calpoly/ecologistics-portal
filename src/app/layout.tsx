"use client";
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { useState } from "react";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// may need to be moved elsewhere
// export const metadata: Metadata = {
//   title: "Ecologistics",
//   description: "Ecologistics Web Portal",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Header
            toggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          <div className="flex">
            <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
            {children}
          </div>
          {/* <Footer /> */}
        </body>
      </ClerkProvider>
    </html>
  );
}
