import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/sidebar";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "Ecologistics",
  description: "Ecologistics Web Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Header />
          <div className="flex">
            <Sidebar />
            {children}
          </div>
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}
