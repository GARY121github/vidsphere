import { Home, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavbarSetting = () => {
  return (
    <header className="border-b-[2px] h-16 sm:h-20 bg-black z-50 drop-shadow-md fixed w-full flex justify-between text-2xl p-4 font-medium">
      <Link href="/setting/profile" className="flex gap-2 items-center">
        <Settings size={36} fill="red" strokeWidth={1} color="black" /> Settings{" "}
      </Link>
      <Link href="/" className="flex gap-2 items-center">
        <Home size={32} fill="red" strokeWidth={1} color="black" /> Home{" "}
      </Link>
    </header>
  );
};

export default NavbarSetting;
