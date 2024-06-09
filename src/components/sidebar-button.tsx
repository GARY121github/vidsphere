import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // helper function to merge all the tailwind classes into one string

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon;
}
const SidebarButton = ({
  icon: Icon,
  className,
  children,
  ...props
}: SidebarButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(`gap-2 justify-start text-lg `, className)}
      {...props}
    >
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </Button>
  );
};

export default SidebarButton;
