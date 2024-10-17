"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search, LogOut, X, VideoIcon, Settings } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Video, FileVideo, Radio } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [inputVisible, setInputVisible] = useState(false);
  const handleXClick = (event: any) => {
    event.stopPropagation();

    setInputVisible(false);
  };

  const handleSClick = (event: any) => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      event.stopPropagation();
      setInputVisible(true);
    }
  };

  return (
    <div className="border-b-[2px] border-slate-600 h-20 bg-black">
      <div
        className={`${inputVisible ? "hidden" : "h-full flex justify-between items-center py-2  max-m-sm gap-4 mx-4"}`}
      >
        <div className={`flex justify-center items-center`}>
          <Image
            className="md:w-12 md:h-12"
            src="/images/logo.png"
            width={8}
            height={8}
            alt="application logo"
          />
        </div>

        <div className="flex sm:flex-grow xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-4xl sm:relative">
          <div
            className={`w-full flex rounded-md  items-center`}
            id="search-menu"
            onClick={handleSClick}
          >
            <Input
              placeholder="Search ..."
              className="hidden sm:inline-block"
            />
            <Button
              className={`bg-slate-500 w-[2.7rem] md:w-[4rem] sm:absolute right-0`}
            >
              <Search className="text-black" />
            </Button>
          </div>
        </div>

        <div className={`flex justify-center items-center gap-5`}>
          <div>
            {user ? (
              <Link href={`/studio/channel/${user._id}`}>
                <VideoIcon size={42} />
              </Link>
            ) : (
              <Skeleton className="h-10 w-10 rounded-full" />
            )}
          </div>
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
                    onClick={() => router.push("/setting/profile")}
                    className="flex justify-start gap-2 cursor-pointer"
                  >
                    <Settings /> <p>Settings</p>
                  </DropdownMenuItem>
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
      <div
        className={`${inputVisible ? "flex justify-between items-center py-2  max-m-sm gap-4 mx-4" : "hidden"}`}
      >
        <div
          className={`flex ${inputVisible ? "flex-grow rounded-md" : "flex-none rounded-full hidden"}  items-center  bg-white p-1 sm:p-2`}
          id="search-menu"
          onClick={handleSClick}
        >
          <Button
            className={`bg-slate-500 w-[2.7rem] md:w-[4rem] ${inputVisible ? "rounded-md" : "rounded-full"}`}
          >
            <Search className="text-black" />
          </Button>
          <Input
            placeholder="Search ..."
            className={`${inputVisible ? "inline-block" : "hidden"} `}
          />
          <X
            className={`${inputVisible ? "inline-block" : "hidden"} px-2 text-black w-[10%]`}
            onClick={handleXClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
