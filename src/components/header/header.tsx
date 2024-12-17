"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AlignRight, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 w-full z-50">
      <nav className="bg-gray-800 border-gray-200 border-b-[1px] rounded-b-xl shadow-lg shadow-black py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link href="/" className="flex items-center">
            <Image
              // className="md:w-36 md:h-20"
              src="/images/logo.png"
              width={100}
              height={25}
              alt="application logo"
            />
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div
                className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : "rotate-0"}`}
              >
                {isMobileMenuOpen ? <X /> : <AlignRight />}
              </div>
            </button>
          </div>

          {/* Menu items */}
          <div
            className={`lg:flex lg:items-center lg:order-2 ${
              isMobileMenuOpen
                ? "absolute top-14 right-0 bg-slate-500 p-2 rounded-md"
                : "hidden"
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <Link
                href="/sign-up"
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
