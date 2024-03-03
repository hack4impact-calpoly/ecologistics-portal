"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import SponsoredOrgCard from "@/components/sponsored-org-card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (!user?.publicMetadata?.admin) {
    return router.push("/");
  }
  return (
    <main className="m-10">
      <h1>
        {/* Page header */}
        <div className="font-sans text-3xl mb-10">
          SPONSORED ORGANZATIONS/PROJECTS
        </div>
      </h1>
      {/* Row of buttons */}
      <div className="w-full flex items-center justify-between">
        {/* Add New Org Button */}
        <Button className="w-44 h-11 bg-[#F18030] hover:bg-orange-400 text-white drop-shadow-md">
          + Add New Org
        </Button>
        {/* View All / View Updates toggles */}
        <div>
          <Toggle className="text-lg h-11 rounded-none border px-8 border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white">
            VIEW ALL
          </Toggle>
          <Toggle className="text-lg h-11 rounded-none px-8 border border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white">
            VIEW UPDATES
            <div className="relative w-7 h-7 ml-3 bg-[#335543] rounded-full flex items-center justify-center text-white text-sm">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* placeholder number */}3
              </div>
            </div>
          </Toggle>
          {/* Search bar */}
        </div>
        <div className="w-72 h-11 rounded-full shadow-xl">
          {/* Add magnifying glass here */}
          <Input
            placeholder="Search"
            className="border-none rounded-full p-4 text-xl focus:outline-none"
          />
        </div>
      </div>
      <div className="py-10">
        <SponsoredOrgCard
          image={
            "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
          }
          organization={"Test Org"}
          user={"Test User"}
          email={"email@example.com"}
        />
      </div>
    </main>
  );
}
