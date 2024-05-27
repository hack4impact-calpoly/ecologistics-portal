"use client";

import Link from "next/link";
import Image from "next/image";
import AlertDropdown from "./alert-dropdown";
import NewUserButton from "./user-button";
import { useUser } from "@clerk/nextjs";
import { verifyAdmin } from "@/lib/admin";

export default function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="bg-[#EDEBDA]">
      <div className="py-1.5">
        <div className="flex justify-between items-center px-7 h-16">
          <Link href="/">
            <Image src="/images/ecologistics-logo.svg" alt="Ecologistics Logo" width={216} height={36} />
          </Link>
          {isSignedIn && (
            <div className="z-10">
              <div className="flex space-x-4">
                {!verifyAdmin({ publicMetadata: user.publicMetadata }) && <AlertDropdown />}
                <NewUserButton />
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
