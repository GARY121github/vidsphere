"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChannelNavigation({
  channelName,
  className,
}: {
  channelName: string;
  className?: string;
}) {
  const currentPath = usePathname();

  const channelNavigationList = [
    {
      name: "Home",
      link: `/${channelName}`,
    },
    {
      name: "Videos",
      link: `/${channelName}/videos`,
    },
    {
      name: "Playlist",
      link: `/${channelName}/playlist`,
    },
    {
      name: "Posts",
      link: `/${channelName}/posts`,
    },
  ];

  return (
    <div className={`flex gap-5 border-b-2 border-slate-500 p-3 ${className}`}>
      {channelNavigationList.map((item) => (
        <Link
          key={item.name}
          href={item.link}
          className={`text-lg text-slate-200 font-semibold hover:underline underline-offset-[16px] decoration-slate-200 ${currentPath === item.link ? "underline decoration-4 text-slate-100 decoration-slate-100" : ""}`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
