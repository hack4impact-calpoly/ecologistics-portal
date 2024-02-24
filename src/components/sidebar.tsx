"use client";
import React, { useState } from "react";
import { Nav } from "./nav";
import {
  HomeIcon,
  FileTextIcon,
  PinLeftIcon,
  PinRightIcon,
} from "@radix-ui/react-icons";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Home",
            route: "/",
            icon: HomeIcon,
          },
          {
            title: "Sponsors",
            route: "/sponsors",
            icon: FileTextIcon,
          },
        ]}
      />
    </div>
  );
};

export default Sidebar;
