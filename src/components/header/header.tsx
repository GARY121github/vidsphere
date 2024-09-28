import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky top-0 w-full">
      <nav className="bg-gray-800 border-gray-200 border-b-[1px] rounded-b-xl shadow-lg shadow-black py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              width={48} // Specify the width in pixels
              height={48} // Specify the height in pixels
              className="w-8 h-8 md:w-12 md:h-12"
              alt="VidSphere Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-100">
              VidSphere
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <div className="flex gap-4">
              <Link
                href="/sign-up"
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
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
