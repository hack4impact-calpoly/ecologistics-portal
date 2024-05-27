"use client";

import FullscreenSpinner from "@/components/fullscreen-spinner";
import { SponsoredOrgList } from "@/components/admin/sponsored-org-list";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Organization } from "@/database/organization-schema";
import Status from "@/lib/enum";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//clerk user as key and num of updates as value
type UpdateCounts = {
  [key: string]: number;
};

export type OrganizationWithUser = Organization & {
  clerkUserId: string;
  clerkUserName: string;
  clerkUserEmail: string;
};

// Helper function to retrieve a list of organizations with pending reimbursements
async function filterUpdatedOrgs(organizations: OrganizationWithUser[]) {
  const filteredOrgs: OrganizationWithUser[] = [];
  let updateCount: UpdateCounts = {};
  // Check each organization
  for (const org of organizations) {
    let pending = false;
    if (org?.reimbursements?.length > 0) {
      let numOfUpdates = 0;
      if (org.reimbursements) {
        for (const reimbursementId of org.reimbursements) {
          // Fetch reimbursement from API
          const reimbursement = await getReimbursement(reimbursementId.toString());
          // Check if reimbursement has a pending status
          if (reimbursement && reimbursement.status === Status.Pending) {
            pending = true;
            numOfUpdates++; // increment number of updates
          }
        }
      }
      updateCount[org.clerkUserId] = numOfUpdates;
      // Add organization to list if it had a pending reimbursement
      if (pending) {
        filteredOrgs.push(org);
      }
    }
  }
  return { filteredOrgs, updateCount };
}

// Fetch list of organizations
async function getOrganizations() {
  try {
    const res = await fetch("/api/user");
    if (!res.ok) {
      throw new Error("Failed to fetch organizations");
    }
    const users: User[] = await res.json();
    const organizations: OrganizationWithUser[] = [];
    users.forEach((user) => {
      if (user?.unsafeMetadata?.organization) {
        let org = {
          ...(user.unsafeMetadata.organization as Organization),
          clerkUserId: user.id,
          clerkUserName: `${user.firstName} ${user.lastName}`,
          clerkUserEmail: user.emailAddresses[0].emailAddress,
        };
        organizations.push(org);
      }
    });
    return organizations;
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return [];
  }
}

// Fetch reimbursement info from API
async function getReimbursement(reimbursementId: string) {
  try {
    const res = await fetch(
      `/api/reimbursement/${reimbursementId}`, // Replace with official API route
    );

    if (!res.ok) {
      throw new Error("Failed to fetch reimbursement");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

const filterByNames = (orgs: OrganizationWithUser[], search: string) =>
  orgs.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.clerkUserName?.toLowerCase().includes(search.toLowerCase()),
  );

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<OrganizationWithUser[]>([]); // State for currently displayed organizations based on view settings
  const [updatedOrgs, setUpdatedOrgs] = useState<OrganizationWithUser[]>([]); // State for organizations with pending updates (filtered)
  const [pendingOrgs, setPendingOrgs] = useState<OrganizationWithUser[]>([]); // State for organizations pending approval
  const [allOrgs, setAllOrgs] = useState<OrganizationWithUser[]>([]); // State for all organizations (unfiltered)
  const [allUpdatedOrgs, setAllUpdatedOrgs] = useState<OrganizationWithUser[]>([]); // State for all organizations with pending updates
  const [allPendingOrgs, setAllPendingOrgs] = useState<OrganizationWithUser[]>([]); // State for all organizations pending approval
  const [search, setSearch] = useState("");
  const [updateCount, setUpdateCount] = useState<UpdateCounts>({});

  useEffect(() => {
    if (search) {
      setOrgs(filterByNames(allOrgs, search));
      setUpdatedOrgs(filterByNames(allUpdatedOrgs, search));
      setPendingOrgs(filterByNames(allPendingOrgs, search));
    } else {
      setOrgs(allOrgs);
      setUpdatedOrgs(allUpdatedOrgs);
      setPendingOrgs(allPendingOrgs);
    }
  }, [search, allOrgs, allUpdatedOrgs, allPendingOrgs]);

  useEffect(() => {
    getOrganizations().then(async (orgs) => {
      const { filteredOrgs, updateCount } = await filterUpdatedOrgs(orgs);
      setAllOrgs(orgs);
      setAllUpdatedOrgs(filteredOrgs);
      setAllPendingOrgs(orgs.filter((org) => !org.approved));
      setUpdateCount(updateCount);
      setLoading(false);
    });
  }, []);

  if (!isLoaded || loading) {
    return <FullscreenSpinner />;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (!user?.publicMetadata?.admin) {
    return router.push("/");
  }

  return (
    <main className="px-14 py-12 overflow-y-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-6 items-center">
          <h1 className="font-bold text-2xl">Sponsored Organizations</h1>
        </div>
      </div>
      <Tabs defaultValue="all" className="mt-10">
        {/* Row of buttons */}
        <div className="w-full flex items-center justify-between mb-10">
          {/* View All / View Updates toggles */}
          <div className="w-full flex items-center justify-between mb-10 relative">
            <div className="mr-auto relative w-72 h-11">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="pl-12 pr-4 py-2 rounded-full w-full h-full"
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <TabsList>
                <TabsTrigger value="all">View All</TabsTrigger>
                <TabsTrigger value="updates">View Updates</TabsTrigger>
                <TabsTrigger value="pending">View Pending</TabsTrigger>
              </TabsList>
            </div>
            <div className="ml-auto w-72" />
          </div>
        </div>
        <TabsContent value="all">
          <SponsoredOrgList organizations={orgs} updateCount={updateCount} />
        </TabsContent>
        <TabsContent value="updates">
          <SponsoredOrgList organizations={updatedOrgs} updateCount={updateCount} />
        </TabsContent>
        <TabsContent value="pending">
          <SponsoredOrgList organizations={pendingOrgs} updateCount={updateCount} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
