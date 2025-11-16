import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HemaLens-AI-Powered Anemia Detection",
  description:
    "Screen for signs of anemia without needles. HemaLens uses AI to analyze a photo of your palm for a fast, painless, and instant preliminary health check. Try it now.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
{children}
        <Toaster richColors />
        </SessionWrapper>
        
      </body>
    </html>
  );
}
