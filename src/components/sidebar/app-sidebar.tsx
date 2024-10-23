"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { desktopItems } from "./sidebar-items";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" className="mt-20">
      <SidebarHeader />
      <SidebarContent className="mx-2">
        <SidebarGroup title="Main">
          <SidebarGroupContent>
            <SidebarMenu>
              {desktopItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`flex gap-6 p-4 text-md [&>svg]:size-6 group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:[&>svg]:size-6 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!w-20 group-data-[collapsible=icon]:!h-16 group-data-[collapsible=icon]:text-[0.50rem] group-data-[collapsible=icon]:flex-col ${item.href === pathname ? "bg-gray-900" : ""}`}
                    size="lg"
                  >
                    <Link href={item.href} passHref>
                      {item.icon && (
                        <item.icon
                          fill={item.href === pathname ? "white" : ""}
                          strokeWidth={1}
                        />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
