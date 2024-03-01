"use client";
import React, { use, useState } from "react";
import { Nav } from "./nav";
import {
  HomeIcon,
  FileTextIcon,
  PinLeftIcon,
  PinRightIcon,
} from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";
import { set } from "mongoose";

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
    icon: FileTextIcon,
  },
];

const selectLink = (user: any) => {
  if (user?.publicMetadata?.admin) {
    return links.slice(0, 2);
  } else if (user?.publicMetadata?.organization) {
    return links[0];
  } else if (user?.publicMetadata?.organization?.approved) {
    return links.slice(0, 1).concat(links[2]);
  } else {
    return links[0];
  }
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return (
      <div
        className={`flex flex-col h-screen bg-[#335543] ${
          !isCollapsed ? "w-64" : "w-17"
        }`}
      >
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

  const selectedLinks = selectLink(user);

  return (
    <div
      className={`flex flex-col h-screen bg-[#335543] ${
        !isCollapsed ? "w-64" : "w-17"
      }`}
    >
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
      <Nav isCollapsed={isCollapsed} links={links} />
    </div>
  );
};

export default Sidebar;
