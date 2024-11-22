import NavbarSetting from "@/components/navbar/navbar-setting";
import SidebarSetting from "@/components/sidebar/sidebar-setting";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavbarSetting />
      <SidebarSetting />
      <div className="px-8 py-8 mt-20 w-full">{children}</div>
    </>
  );
};

export default Layout;
