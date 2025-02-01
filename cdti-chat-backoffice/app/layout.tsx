import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./_components/SessionProvider";
import { getServerSession } from "next-auth";
import AppNavBar from "./_components/chat/AppNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P'YUI-GPT",
  description: "This web application is for CDTI P'YUI-GPT.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* <AppNavBar /> */}
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
