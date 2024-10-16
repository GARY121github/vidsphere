"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { desktopItems } from "./sidebar-items";

export default function SidebarDesktop() {
  const pathname = usePathname();

  return (
    <aside className="max-w-xs left-0 top-0 z-40 bg-black h-full border-r-[1px] border-slate-600">
      <div className="h-full px-3 py-4">
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {desktopItems.map((item, index) => (
              <Link key={index} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="flex gap-2 justify-start items-center text-lg w-full"
                >
                  {item.icon && <item.icon size={20} />}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
