"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

const StudioNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="border-b-[2px] border-slate-600">
      <div
        className={
          "flex justify-between items-center py-2  max-m-sm gap-4 mx-4"
        }
      >
        <div className={`flex items-center gap-1`}>
          <Video className="p-0 md:h-10 md:w-10" />
          <h1 className="text-white font-semibold text-lg md:text-3xl">
            Studio
          </h1>
        </div>

        <div className="flex justify-center items-center gap-5">
          <div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-8 h-8 md:w-12 md:h-12">
                    <AvatarImage src={user?.avatar} alt="@shadcn" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex justify-start gap-2 cursor-pointer"
                  >
                    <LogOut /> <p>Logout</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Skeleton className="w-12 h-12 rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioNavbar;
