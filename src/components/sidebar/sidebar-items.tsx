import {
  LucideIcon,
  Folder,
  Home,
  ThumbsUp,
  Timer,
  Video,
  LayoutDashboard,
  ListPlus,
  CirclePlus,
  SquarePlay,
  Settings2,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const desktopItems: SidebarItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Liked Videos", href: "/liked-videos", icon: ThumbsUp },
  { label: "History", href: "/history", icon: Timer },
  { label: "My Content", href: "/my-content", icon: Video },
  { label: "Collection", href: "/collections", icon: Folder },
  { label: "Settings", href: "/setting/profile", icon: Settings2 },
];

export const studioItems: SidebarItem[] = [
  { label: "Dashboard", href: "/studio/channel", icon: LayoutDashboard },
  { label: "Content", href: "/studio/channel/content", icon: SquarePlay },
  { label: "Playlist", href: "/studio/channel/playlist", icon: ListPlus },
  { label: "Post", href: "/studio/channel/post", icon: CirclePlus },
];
