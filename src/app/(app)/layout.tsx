import Navbar from "@/components/navbar/navbar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/sidebar-app";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Navbar />
      <AppSidebar />
      <div className="px-8 py-8 mt-20 w-full">{children}</div>
    </SidebarProvider>
  );
};

export default Layout;
