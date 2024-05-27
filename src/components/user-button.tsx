"use client";

import { UserProfile, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NewUserButton() {
  const { isSignedIn, user } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  // Open Profile
  const handleManageAccountClick = () => {
    setShowUserProfile(true);
  };
  // Close Profile
  const handleExitUserProfile = () => {
    setShowUserProfile(false);
  };

  if (isSignedIn) {
    return (
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-[#DDD9C0] rounded-md">
            <div className="flex max-h-8 m-4 items-center">
              <Image
                src={user.imageUrl}
                alt="User Profile Picture"
                width={32}
                height={32}
                className="rounded-full max-w-8 max-h-8"
              />
              <div className="flex flex-col max-h-8 mx-3">
                <div className="text-sm leading-4 font-semibold text-start">{user.fullName}</div>
                <div className="text-xs leading-4 font-light text-start">{user.primaryEmailAddress?.emailAddress}</div>
              </div>
              <ChevronDownIcon className="w-auto h-5 ml-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuItem onClick={handleManageAccountClick}>Manage account</DropdownMenuItem>
            {/* Routes Sign Out to '/' */}
            <DropdownMenuItem onClick={() => signOut(() => router.push("/"))}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Show profile similar to Clerk's deafult UserButton */}
        {showUserProfile && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
            <div className="flex h-3/4">
              <UserProfile
                appearance={{
                  elements: {
                    rootBox: "h-full",
                  },
                }}
              />
              {/* Exit button for User Profile */}
              <div className="relative right-20 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 flex justify-center items-center rounded-lg"
                  onClick={handleExitUserProfile}
                >
                  <Cross2Icon />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}
