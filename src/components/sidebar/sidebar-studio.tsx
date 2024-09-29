"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { studioItems } from "./sidebar-items";
import { useSession } from "next-auth/react";

export default function SidebarStudio() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname(); // Get the current URL

  return (
    <aside className="w-[270px] max-w-xs left-0 top-0 z-40 bg-black h-screen border-r-[1px] border-slate-600">
      <div className="h-full px-3 py-4">
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {user &&
              studioItems.map((item, index) => {
                // Create the dynamic link
                const hrefParts = item.href.split("/");
                const link = `${hrefParts[0]}/${hrefParts[1]}/${hrefParts[2] || ""}/${user?._id}/${hrefParts.length === 4 ? hrefParts[3] : ""}`;

                // Compare pathname with the generated link
                const isActive = pathname === link;

                return (
                  <Link key={index} href={link} passHref>
                    <Button
                      variant={isActive ? "secondary" : "ghost"} // Set the active variant if matches
                      className="flex gap-2 justify-start items-center text-lg w-full"
                    >
                      {item.icon && <item.icon size={20} />}
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </aside>
  );
}
