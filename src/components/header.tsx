"use client";

import { useState } from "react";
import { BellIcon } from "@radix-ui/react-icons";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "components/ui/dropdown-menu";

export default function Header() {
  const [hasNewUpdates, setHasNewUpdates] = useState(true); // Assume there are new updates initially

  const statusUpdates = [
    { id: 1, text: "Request A approved" },
    { id: 2, text: "Request B approved" },
    { id: 3, text: "Request C denied" },
  ];

  const handleDropdownOpen = () => {
    setHasNewUpdates(false); // Resets the new updates state when dropdown is opened
  };

  return (
    <nav className="bg-white">
      <div className="py-1">
        <div className="flex justify-between items-center px-5 h-16">
          <Link href="/">
            <Image
              src="/images/ecologistics-logo.svg"
              alt="Ecologistics Logo"
              width={216}
              height={36}
            />
          </Link>
          <div className="flex space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button onClick={handleDropdownOpen} value="bell">
                  <div className="relative">
                    <BellIcon className="w-6 h-6" />
                    {hasNewUpdates && <span className="badge"></span>}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="right-0">
                <DropdownMenuLabel>Recent Updates</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusUpdates.map((statusUpdate) => (
                  <DropdownMenuItem key={statusUpdate.id}>
                    {statusUpdate.text}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton />
          </div>
        </div>
      </div>
      <style jsx>{`
        .badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background-color: red;
          border-radius: 50%;
        }
      `}</style>
    </nav>
  );
}
