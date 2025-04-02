import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnowMeBetter | Anonymous Confessions",
  description: "Sent messages / AI generated questions anonymously. Share thoughts, seek advice, or just have fun – all while staying completely incognito!",
  keywords: [
    "KnowMeBetter",
    "Anonymous AI Messaging",
    "AI Conversations",
    "AI Generated Messages",
    "Anonymous Feedback",
    "Confession Platform",
    "Private Messaging",
    "AI Powered Communication",
    "Safe Anonymous Platform",
  ],
  robots: "index, follow",
  themeColor: "#4F46E5", // A cool blueish-purple color for branding
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar/>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
