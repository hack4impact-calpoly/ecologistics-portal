"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    route: string;
    icon: any;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();
  const isItemActive = (path: string) => {
    return path === pathname;
  };
  return (
    <nav className="flex flex-col gap-4 px-2">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.route}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start rounded-lg py-6 hover:text-[#F18030] text-white",
            !isCollapsed && "w-60",
            isItemActive(link.route) && "text-[#F18030] bg-accent",
          )}
        >
          <link.icon className="h-[25px] w-[25px]" />
          {!isCollapsed && <span className="text-base ml-5">{link.title}</span>}
        </Link>
      ))}
    </nav>
  );
}
