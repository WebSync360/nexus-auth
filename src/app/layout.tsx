import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/providers/root-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Auth | Production-Ready SaaS Foundation",
  description: "Secure Auth-to-DB synchronization built with Next.js 15, Clerk, and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#4f46e5" }, 
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-50 antialiased selection:bg-indigo-500/30`}
        >
          <RootProvider>
            {children}
          </RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}