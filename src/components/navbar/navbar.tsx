"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search, LogOut, X } from "lucide-react";
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
import { signOut } from "next-auth/react";

const Navbar = () => {
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
    <div className="border-b-[2px] border-slate-600">
      <div
        className={`${inputVisible ? "hidden" : "flex justify-between items-center py-2  max-m-sm gap-4 mx-4 "}`}
      >
        <div className={`flex justify-center items-center`}>
          <Image
            className="md:w-12 md:h-12"
            src="/images/logo.png"
            width={8}
            height={8}
            alt="application logo"
          />
          <p className="font-semibold text-xs md:text-base ml-2 text-white">
            VidSphere
          </p>
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

        <div className={`flex justify-center items-center gap-4`}>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Video className="w-8 h-8 md:w-12 md:h-12" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="gap-2 ">
                <DropdownMenuLabel>
                  <div className="flex justify-center items-center gap-2">
                    <FileVideo className="w-4 h-4" />
                    Upload Video
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuLabel>
                  <div className="flex justify-start items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Go Live
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8 md:w-12 md:h-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex justify-around cursor-pointer"
                >
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
