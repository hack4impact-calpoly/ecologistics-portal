"use client";

import CenteredSpinner from "@/components/centered-spinner";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import Popup from "@/components/user-info-popup";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";

//shadcn.ui pagination component tools:
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

{
  /* <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>

+ import Link from "next/link"

- type PaginationLinkProps = ... & React.ComponentProps<"a">
+ type PaginationLinkProps = ... & React.ComponentProps<typeof Link>

const PaginationLink = ({...props }: ) => (
  <PaginationItem>
-   <a>
+   <Link>
      // ...
-   </a>
+   </Link>
  </PaginationItem>
) */
}

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
      <div className="w-screen h-screen">
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

          <div className="flex flex-col mt-4">
            <Button
              onClick={() => router.push("/reimbursements")}
              className="bg-orange-500 text-[16px] font-[600] place-self-end"
            >
              Request Reimbursement
            </Button>
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
