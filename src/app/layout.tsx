import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import ReduxProviderWrapper from "@/providers/contexts/redux-context";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VidSphere",
  description: "VidSphere is a video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-black text-white",
          fontSans.variable
        )}
      >
        <main>
          <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
