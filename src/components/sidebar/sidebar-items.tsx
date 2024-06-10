import {
  LucideIcon,
  Folder,
  Home,
  ThumbsUp,
  Timer,
  User,
  Video,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Liked Videos", href: "/", icon: ThumbsUp },
  { label: "History", href: "/history", icon: Timer },
  { label: "My Content", href: "/my-content", icon: Video },
  { label: "Collection", href: "/collections", icon: Folder },
  { label: "Subscribers", href: "/subscribers", icon: User },
];

export default sidebarItems;
