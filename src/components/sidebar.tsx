"use client";
import React, { useState } from "react";
import { Nav } from "./nav";
import { HomeIcon, FileTextIcon, PinLeftIcon, PinRightIcon, DashboardIcon } from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";
import { verifyAdmin } from "@/lib/admin";

const links = [
  {
    title: "Home",
    route: "/",
    icon: HomeIcon,
  },
  {
    title: "Sponsors",
    route: "/sponsored-organizations",
    icon: DashboardIcon,
  },
  {
    title: "Request",
    route: "/request-reimbursement",
    icon: FileTextIcon,
  },
];

const selectLink = (user: any) => {
  if (verifyAdmin(user)) {
    return [links[0], links[1]];
  } else if (user?.unsafeMetadata?.organization?.approved) {
    return [links[0], links[2]];
  } else {
    return [links[0]];
  }
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isLoaded, isSignedIn, user } = useUser();
  // Don't render sidebar when not logged in
  if (!isSignedIn) {
    return null;
  }
  if (!isLoaded) {
    return (
      <div className={`flex flex-col min-w-[81px] bg-[#335543]`}>
        {isCollapsed ? (
          <PinRightIcon
            className="h-[45px] w-[45px] text-white mx-auto my-2 hover:bg-gray-200 hover:bg-opacity-50 p-2 rounded-full cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        ) : (
          <PinLeftIcon
            className="h-[45px] w-[45px] text-white place-self-end my-2 mr-2 p-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-full cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#335543]">
      {isCollapsed ? (
        <PinRightIcon
          className="h-[45px] w-[45px] text-white mx-auto my-2 hover:bg-gray-200 hover:bg-opacity-50 p-2 rounded-full cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      ) : (
        <PinLeftIcon
          className="h-[45px] w-[45px] text-white place-self-end my-2 mr-2 p-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-full cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      <Nav isCollapsed={isCollapsed} links={selectLink(user) as any[]} />
    </div>
  );
};

export default Sidebar;
