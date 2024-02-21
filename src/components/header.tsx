"use client";

import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusUpdates = [
    { id: 1, text: "Request A approved" },
    { id: 1, text: "Request B approved" },
    { id: 1, text: "Request C denied" },
  ];

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <BellIcon className="w-6 h-6" />
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
        </div>
      </div>
    </nav>
  );
}
