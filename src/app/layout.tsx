import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "Ecologistics",
  description: "Ecologistics Web Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={cn("flex flex-col min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
          <Header />
          {/* fill remaining vertical space */}
          <div className="flex grow">
            <Sidebar />
            {children}
          </div>
          <SpeedInsights />
        </body>
      </ClerkProvider>
    </html>
  );
}
