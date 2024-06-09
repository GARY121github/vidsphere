"use client";

import React from "react";
import SidebarButton from "../sidebar-button";
import { SidebarItems } from "../../types";
import Link from "next/link";
interface SidebarDesktopProps {
  sidebarItems: SidebarItems; // creating custom type
}

const SidebarDesktop = (props: SidebarDesktopProps) => {
  return (
    // h-screen
    // border-r
    <aside className="w-[270px] max-w-xs  left-0 top-0 z-40">
      <div className="h-full px-3 py-4">
        {/* <h3 className='mx-3 text-lg font-semibold text-foreground text-white'>YouTube</h3> */}
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton icon={link.icon}>{link.label}</SidebarButton>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>

    // <h1>hey</h1>
  );
};

export default SidebarDesktop;
