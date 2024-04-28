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
    <nav
      className={`flex flex-col gap-y-4 ${isCollapsed ? "px-4" : "pl-4 w-[200px]"}`}
    >
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.route}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start py-6 rounded-xl text-white hover:bg-gray-200 hover:bg-opacity-50 hover:text-white",
            !isCollapsed && "w-55 rounded-tr-none rounded-br-none",
            isItemActive(link.route) && "bg-gray-200 bg-opacity-50",
          )}
        >
          <link.icon className="h-[25px] w-[25px]" />
          {!isCollapsed && (
            <span className="text-base ml-3 font-[650] text-[18px]">
              {link.title}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
