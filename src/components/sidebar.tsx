"use client";
import React, { useState } from "react";
import { Nav } from "./nav";
import { HomeIcon, FileTextIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";

const links = [
  {
    title: "Home",
    route: "/",
    icon: HomeIcon,
  },
  {
    title: "Sponsored Organizations",
    route: "/sponsored-organizations",
    icon: FileTextIcon,
  },
  {
    title: "Submit Request",
    route: "/reimbursements",
    icon: ReaderIcon,
  },
];

type SidebarProps = {
  isSidebarCollapsed: boolean;
};

const selectLink = (user: any) => {
  if (user?.publicMetadata?.admin) {
    return links.slice(0, 2);
  } else if (user?.publicMetadata?.organization) {
    return links.slice(0);
  } else if (user?.publicMetadata?.organization?.approved) {
    return links.slice(0, 1).concat(links.slice(2, 2));
  } else {
    return links.slice(0, 1);
  }
};

const Sidebar = ({ isSidebarCollapsed }: SidebarProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div
        className={`flex flex-col h-screen bg-[#335543] ${
          isSidebarCollapsed ? "w-17" : "w-64"
        }`}
      ></div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen bg-[#335543] ${
        isSidebarCollapsed ? "w-17" : "w-64"
      }`}
    >
      <Nav isCollapsed={isSidebarCollapsed} links={selectLink(user) as any[]} />
    </div>
  );
};

export default Sidebar;
