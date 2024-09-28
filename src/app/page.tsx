"use client";
import React, { useState } from "react";
import logo from "../../images/logo.png";
import Image from "next/image";
import {
  Layers,
  UserCog,
  MonitorPlay,
  SlidersHorizontal,
  CircleFadingPlus,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <header className="fixed w-full">
        <nav className="bg-gray-800 border-gray-200 border-b-[1px] rounded-b-xl shadow-lg shadow-black py-2.5">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
            <a href="#" className="flex items-center">
              <Image
                src={logo}
                className="w-8 h-8 md:w-12 md:h-12"
                alt="VidSphere Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-100">
                VidSphere
              </span>
            </a>
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
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>
      <section className="bg-gray-900">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Explore, Share &amp; Create <br />
              with VidSphere.
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              VidSphere is a dynamic video-sharing platform designed for
              creators and audiences alike. Collaborate, interact, and discover
              amazing content in one immersive experience.
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <p className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center border  rounded-lg sm:w-auto  text-white border-gray-700 hover:bg-gray-700 focus:ring-gray-800 hover:cursor-pointer">
                Get Started Now!
              </p>
            </div>
          </div>

          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="https://demo.themesberg.com/landwind/images/hero.png"
              alt="hero image"
            />
          </div>
        </div>
      </section>

      <div className="w-full">
        <hr className=" max-w-screen-xl mx-auto" />
      </div>

      <section className="bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
              Features
            </h2>
            <p className="text-gray-500 sm:text-xl">
              VidSphere empowers creators and audiences through collaborative,
              immersive video experiences and technology.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <UserCog className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 text-gray-950" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-950">
                User Accounts
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Login and sign up for personalized experiences across the
                platform.
              </p>
            </div>

            <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <MonitorPlay className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 text-gray-950" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-950">
                Video Upload & Management
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Upload videos with title, description, thumbnail, and video
                files using S3 storage, with SQS and ffmpeg for processing
                multiple qualities.
              </p>
            </div>

            <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <SlidersHorizontal className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 text-gray-950" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-950">
                Video Player Controls
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Play/pause, adjust audio, and switch between video qualities
                using intuitive controls.
              </p>
            </div>

            <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <CircleFadingPlus className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 text-gray-950" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-950">
                Social Interaction
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Comment, like/unlike videos, and subscribe/unsubscribe to
                channels to engage with your favorite content.
              </p>
            </div>

            <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <Layers className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 text-gray-950" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-950">
                Multiple Pages
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Access various pages such as Home, Channel Info, Watch History,
                Liked Videos, and a Studio for managing your content.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-col lg:flex-row md:mt-20">
            <div className="w-full lg:w-1/2">
              <h2 className="font-manrope text-5xl text-gray-900 font-bold leading-[4rem] mb-7 text-center lg:text-left">
                Our leading, strong &amp; creative team
              </h2>
              <p className="text-lg text-gray-500 mb-16 text-center lg:text-left">
                These people work on making our product best.
              </p>
              <button className="cursor-pointer py-3 px-8 w-60 bg-red-600 text-white text-base font-semibold transition-all duration-500 block text-center rounded-full hover:bg-red-700 mx-auto lg:mx-0">
                Join Our team
              </button>
            </div>
            <div className="w-full lg:w-1/2 lg:mt-0 md:mt-40 mt-16 max-lg:max-w-2xl">
              <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                  <img
                    src=""
                    alt="photo"
                    className="w-44 h-56 rounded-2xl object-cover mx-auto"
                  />
                  <p className="mt-2 text-center text-gray-700">Radha Sharma</p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src=""
                    alt="photo"
                    className="w-44 h-56 rounded-2xl object-cover mx-auto"
                  />
                  <p className="mt-2 text-center text-gray-700">
                    Harsh Prakash
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src=""
                    alt="photo"
                    className="w-44 h-56 rounded-2xl object-cover mx-auto"
                  />
                  <p className="mt-2 text-center text-gray-700">Falgun Patel</p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src=""
                    alt="photo"
                    className="w-44 h-56 rounded-2xl object-cover mx-auto"
                  />
                  <p className="mt-2 text-center text-gray-700">Ravi Ranjan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
