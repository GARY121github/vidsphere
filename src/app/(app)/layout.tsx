"use client";

interface LayoutProps {
  children: React.ReactNode;
}

import { Sidebar } from "@/components/sidebar";

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="mx-4 min-h-screen  sm:mx-8 xl:mx-auto">
        {children}
        <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
          <div className="col-span-2 hidden sm:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default layout;
