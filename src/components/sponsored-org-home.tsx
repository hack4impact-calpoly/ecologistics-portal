"use client";

import CenteredSpinner from "@/components/centered-spinner";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import Popup from "@/components/user-info-popup";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";

type organizationInfo = {
  name: string;
  description: string;
  website: string;
  approved: boolean;
};

export default function SponsoredHomePage() {
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
    router.push("/sign-in");
    return;
  }
  if (!user?.unsafeMetadata?.organization) {
    router.push("/setup-organization");
    return;
  }

  const orgInfo = user?.unsafeMetadata?.organization as organizationInfo;

  return (
    <main className="px-14 py-12 h-screen overflow-y-auto w-full">
      <div className="flex items-center justify-between">
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
        <Button
          onClick={() => router.push("/reimbursements")}
          className="bg-orange-500 text-sm place-self-end"
        >
          Request Reimbursement
        </Button>
      </div>
      <div className="flex flex-col mt-8">
        <SponsoredOrgTable />
      </div>
    </main>
  );
}
