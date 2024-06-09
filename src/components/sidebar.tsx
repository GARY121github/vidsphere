"use client";
import { Folder, Home, ThumbsUp, Timer, User, Video } from "lucide-react";
import SidebarDesktop from "./sidebar/sidebarDesktop";
import { SidebarItems } from "@/types";

const sidebarItems: SidebarItems = {
  links: [
    { label: "Home", href: "/", icon: Home },
    { label: "Liked Videos", href: "/", icon: ThumbsUp },
    { label: "History", href: "/", icon: Timer },
    { label: "My Content", href: "/", icon: Video },
    { label: "Collection", href: "/", icon: Folder },
    { label: "Subscribers", href: "/", icon: User },
  ],
};

export function Sidebar() {
  return (
    <SidebarDesktop sidebarItems={sidebarItems} />

    // we can not pass function from server component to client component hence keeping layout a server component and creating this extra component sidebar.tsx to render sidebar
  );
}
