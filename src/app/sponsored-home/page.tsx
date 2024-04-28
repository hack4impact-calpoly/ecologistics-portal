"use client";

import CenteredSpinner from "@/components/centered-spinner";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import Popup from "@/components/user-info-popup";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";

type organizationInfo = {
  name: string;
  description: string;
  website: string;
  approved: boolean;
};

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <CenteredSpinner />
      </div>
    );
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (!user?.unsafeMetadata?.organization) {
    return router.push("/setup-organization");
  }

  const orgInfo = user?.unsafeMetadata?.organization as organizationInfo;

  return (
    <main className="px-14 py-12 h-screen overflow-y-auto w-full">
      <div className="flex gap-x-6 items-center">
        <h1 className="font-bold text-4xl">{orgInfo.name}</h1>
        <Popup
          name={orgInfo.name}
          description={orgInfo.description}
          website={orgInfo.website}
          email={(user?.primaryEmailAddress?.emailAddress as string) || ""}
          user={(user?.fullName as string) || ""}
        />
      </div>
      <div className="flex flex-col mt-8">
        <Tabs.Root defaultValue="all">
          <Tabs.List className="flex gap-x-2 border-b border-gray-500">
            <Tabs.Trigger
              className="text-[15px] px-1 pb-1 font-[500] hover:text-orange-500 data-[state=active]:text-orange-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer"
              value="all"
            >
              All Requests
            </Tabs.Trigger>
            <Tabs.Trigger
              className="text-[15px] px-1 pb-1 font-[500] hover:text-orange-500 data-[state=active]:text-orange-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer"
              value="archived"
            >
              Archived Requests
            </Tabs.Trigger>
          </Tabs.List>

          <div className="py-1">
            <Tabs.Content value="all">
              <SponsoredOrgTable />
            </Tabs.Content>

            <Tabs.Content value="archived"></Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </main>
  );
}
