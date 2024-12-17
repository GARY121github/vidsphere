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
  useSidebar,
} from "@/components/ui/sidebar";
import { desktopItems } from "./sidebar-items";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  // Collapse sidebar if no item href matches the current URL
  useEffect(() => {
    const shouldCollapse = !desktopItems.some((item) => item.href === pathname);
    if (
      (state === "expanded" && shouldCollapse) ||
      (state === "collapsed" && !shouldCollapse)
    ) {
      toggleSidebar();
    }
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" className="mt-20">
      <SidebarHeader />
      <SidebarContent className="mx-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {desktopItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`flex gap-6 p-4 text-md [&>svg]:size-6 group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:[&>svg]:size-6 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!w-20 group-data-[collapsible=icon]:!h-16 group-data-[collapsible=icon]:text-[0.50rem] group-data-[collapsible=icon]:flex-col ${item.href === pathname ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
                    size="lg"
                  >
                    <Link href={item.href} passHref>
                      {item.icon && <item.icon />}
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
