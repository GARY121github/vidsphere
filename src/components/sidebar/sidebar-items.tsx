import {
  LucideIcon,
  Folder,
  Home,
  ThumbsUp,
  Timer,
  User,
  Video,
  LayoutDashboard,
  ListPlus,
  CirclePlus,
  SquarePlay,
  Fingerprint,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const desktopItems: SidebarItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Liked Videos", href: "/", icon: ThumbsUp },
  { label: "History", href: "/history", icon: Timer },
  { label: "My Content", href: "/my-content", icon: Video },
  { label: "Collection", href: "/collections", icon: Folder },
  { label: "Subscribers", href: "/subscribers", icon: User },
];

export const studioItems: SidebarItem[] = [
  { label: "Dashboard", href: "/studio/channel", icon: LayoutDashboard },
  { label: "Content", href: "/studio/channel/content", icon: SquarePlay },
  { label: "Playlist", href: "/studio/channel/playlist", icon: ListPlus },
  { label: "Post", href: "/studio/channel/post", icon: CirclePlus },
];

export const settingItems: SidebarItem[] = [
  { label: "Profile", href: "/setting/profile", icon: User },
  { label: "Security", href: "/setting/security", icon: Fingerprint },
];
