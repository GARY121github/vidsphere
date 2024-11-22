"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingItems } from "./sidebar-items";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function SidebarSetting() {
  const pathname = usePathname();

  return (
    <Sidebar className="mt-20">
      <SidebarContent className="mx-2 mt-4">
        <SidebarGroup title="Main">
          <SidebarGroupContent>
            <SidebarMenu>
              {settingItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`flex gap-6 p-4 text-md [&>svg]:size-6 ${item.href === pathname ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
                    size="lg"
                  >
                    <Link key={index} href={item.href} passHref>
                      {item.icon && <item.icon size={20} />}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
