import Navbar from "@/components/navbar/navbar";
import SidebarDesktop from "@/components/sidebar/sidebar-desktop";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col max-h-screen">
      <div className="drop-shadow-md h-20 fixed w-full">
        <Navbar />
      </div>
      <div className="flex flex-grow mt-20 overflow-auto">
        <div className="hidden md:flex md:flex-col md:w-64 bg-gray-200 fixed max-h-screen h-full">
          <SidebarDesktop />
        </div>
        <div className="flex-grow p-4 md:ml-64 -z-10">
          <div className="grid gap-4 grid-cols-1 px-8 py-4 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
