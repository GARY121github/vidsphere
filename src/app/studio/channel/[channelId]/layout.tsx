import Navbar from "@/components/navbar/navbar";
import SidebarStudio from "@/components/sidebar/sidebar-studio";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="drop-shadow-md">
        <Navbar />
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="hidden md:flex md:flex-col md:w-64 bg-gray-200">
          <SidebarStudio />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <div className="grid gap-4 grid-cols-1 px-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
