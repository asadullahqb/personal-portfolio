import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Do NOT import usePathname here, or any other client hooks
// The Navbar will be refactored into a client component in its own file

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asadullah Qamar Bhatti | Data Scientist",
  description: "Passionate full-stack Data Scientist and AI Developer.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

// Import the Navbar as a client component
import Navbar from "./Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
