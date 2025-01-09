"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname();

  const settingNavigation = [
    {
      name: "Profile",
      link: `/setting/profile`,
    },
    {
      name: "Security",
      link: `/setting/security`,
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="flex gap-5 mt-5 mb-10">
        {settingNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className={`text-xl text-slate-200 font-semibold hover:underline underline-offset-[16px] decoration-slate-200 ${currentPath === item.link ? "underline decoration-4 text-slate-100 decoration-slate-100" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
