import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import ReduxProviderWrapper from "@/providers/contexts/redux-context";
import AuthProvider from "@/providers/contexts/auth-context";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider } from "@/components/ui/sidebar";

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
      <AuthProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased bg-black text-white",
            fontSans.variable
          )}
        >
          <NextTopLoader color="#d62828" height={3} showSpinner={false} />
          <main>
            <SidebarProvider>
              <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
            </SidebarProvider>
          </main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
