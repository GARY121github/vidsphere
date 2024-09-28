import {
  Github,
  Linkedin,
  Twitter,
  VideoIcon,
  ServerIcon,
  ShieldCheckIcon,
  BarChartIcon,
  SmartphoneIcon,
  CloudIcon,
  MonitorIcon,
  FilmIcon,
  GlobeIcon,
} from "lucide-react";
import Link from "next/link";
import TeamData from "../../data/team.json";
import Header from "@/components/header/header";
import Image from "next/image";

export default function LandingPage() {
  const Features = [
    {
      title: "Multi-Resolution Video Streaming",
      description:
        "Stream videos in 480p, 720p, and 1080p for optimal quality on all devices, ensuring smooth playback regardless of bandwidth.",
      icon: <VideoIcon />,
    },
    {
      title: "HLS Streaming Support",
      description:
        "Deliver videos efficiently with HLS technology, offering adaptive bitrate streaming using .m3u8 and .ts segments for seamless experiences.",
      icon: <ServerIcon />,
    },
    {
      title: "Secure Authentication & Access",
      description:
        "Protect your platform with OAuth 2.0 and JWT token-based authentication, ensuring only authorized users can access your content.",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Advanced Analytics & Insights",
      description:
        "Track user engagement, video performance, and in-depth metrics with real-time analytics for better business decision-making.",
      icon: <BarChartIcon />,
    },
    {
      title: "Cross-Platform Compatibility",
      description:
        "Enjoy seamless video access across all devices, including desktops, tablets, and smartphones, optimizing the viewing experience.",
      icon: <SmartphoneIcon />,
    },
    {
      title: "Scalable Cloud Infrastructure",
      description:
        "Leverage a cloud-native architecture using AWS for scalability and reliability, ensuring uninterrupted service during peak traffic.",
      icon: <CloudIcon />,
    },
    {
      title: "Responsive Frontend with React",
      description:
        "Build interactive user interfaces using React, ensuring a dynamic and responsive user experience across all devices.",
      icon: <MonitorIcon />,
    },
    {
      title: "Efficient Video Transcoding",
      description:
        "Utilize FFmpeg for high-quality video transcoding, converting your media into various formats to ensure compatibility across platforms.",
      icon: <FilmIcon />,
    },
    {
      title: "Advanced CDN Integration",
      description:
        "Optimize content delivery through advanced CDN integration, reducing latency and ensuring quick loading times for users worldwide.",
      icon: <GlobeIcon />,
    },
  ];

  return (
    <div>
      <Header />
      <section className="bg-gray-900">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Explore, Share &amp; Create <br />
              with VidSphere.
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Vidsphere is a cutting-edge video streaming platform designed to
              enhance your content delivery experience. With seamless user
              authentication, high-quality video transcoding into multiple
              resolutions, and optimized performance using modern web
              technologies, Vidsphere ensures a smooth and immersive streaming
              experience. Powered by HLS video formats, advanced UI components,
              and secure data management, Vidsphere sets a new standard in
              digital media streaming.
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <Link
                href="/sign-in"
                className="cursor-pointer py-3 px-8 w-60 bg-red-600 text-white text-base font-semibold transition-all duration-500 block text-center rounded-full hover:bg-red-700 mx-auto lg:mx-0"
              >
                Get Started Now!
              </Link>
            </div>
          </div>

          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <Image src="/images/hero.png" alt="hero image" />
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
            {Features.map((feature, index) => {
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-lg flex items-start space-x-4"
                >
                  <div className="w-10 h-10">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 mt-2">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-col lg:flex-row md:mt-20">
            <div className="w-full lg:w-1/2">
              <h2 className="font-manrope text-5xl text-white font-bold leading-[4rem] mb-7 text-center lg:text-left">
                Our leading, strong &amp; creative team
              </h2>
              <p className="text-lg text-gray-500 mb-16 text-center lg:text-left">
                These people work on making our product best.
              </p>
              <p className="cursor-pointer py-3 px-8 w-60 bg-red-600 text-white text-base font-semibold transition-all duration-500 block text-center rounded-full hover:bg-red-700 mx-auto lg:mx-0">
                Join Our team
              </p>
            </div>
            <div className="w-full lg:w-1/2 lg:mt-0 md:mt-40 mt-16 max-lg:max-w-2xl">
              <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {TeamData.map((teamMember, index) => (
                  <div className="flex flex-col items-center" key={index}>
                    <Image
                      src={teamMember.profile}
                      alt="photo"
                      className="w-60 rounded-2xl object-cover mx-auto"
                    />
                    <p className="m-2 text-center">{teamMember.name}</p>
                    <div className="flex justify-between w-4/5">
                      <Link href={teamMember.github}>
                        <Github />
                      </Link>
                      <Link href={teamMember.linkedIn}>
                        <Linkedin />
                      </Link>
                      <Link href={teamMember.twitter}>
                        <Twitter />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
