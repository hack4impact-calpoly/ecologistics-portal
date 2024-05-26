"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import SponsorCard from "@/components/sponsored-org-card";
import { Organization } from "@/database/organization-schema";
import { Types } from "mongoose";
import { useEffect, useState } from "react";
import CenteredSpinner from "@/components/centered-spinner";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

//clerk user as key and num of updates as value
type UpdateCounts = {
  [key: string]: number;
};

// Helper function to retrieve a list of organizations with pending reimbursements
async function filterOrganizationsWithPendingReimbursements(
  organizations: Organization[],
) {
  const filteredOrgs: Organization[] = [];
  let updateCount: UpdateCounts = {};
  // Check each organization
  for (const org of organizations) {
    let pending = false;
    if (org?.reimbursements?.length) {
      let numOfUpdates = 0;
      if (org.reimbursements) {
        for (const reimbursementId of org.reimbursements) {
          // Fetch reimbursement from API
          const reimbursement = await getReimbursement(
            reimbursementId.toString(),
          );
          // Check if reimbursement has a pending status
          if (reimbursement && reimbursement.status === "Pending") {
            pending = true;
            numOfUpdates++; // increment number of updates
            break; // If it has at least one pending reimbursement, no need to keep checking the same organization
          }
        }
      }
      updateCount[org.clerkUser] = numOfUpdates;
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
    const data = await res.json();
    const organizations: Organization[] = [];
    data.forEach((obj: any) => {
      if (obj.unsafeMetadata.organization) {
        let org = { clerkUser: obj.id, ...obj.unsafeMetadata.organization };
        organizations.push(org);
      }
    });
    return organizations;
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
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

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [viewTab, setViewTab] = useState(""); // State for tab toggle
  const [orgs, setOrgs] = useState<Organization[]>([]); // State for currently displayed organizations based on view settings
  const [updatedOrgs, setUpdatedOrgs] = useState<Organization[]>([]); // State for organizations with pending updates (filtered)
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]); // State for organizations pending approval
  const [allOrgs, setAllOrgs] = useState<Organization[]>([]); // State for all organizations (unfiltered)
  const [allUpdatedOrgs, setAllUpdatedOrgs] = useState<Organization[]>([]); // State for all organizations with pending updates (filtered)
  const [search, setSearch] = useState("");
  const [updateCount, setUpdateCount] = useState<UpdateCounts>({});
  // Turn off viewUpdates when View All is toggled
  const handleViewAllToggle = () => {
    setViewTab("");
  };

  // Turn on viewUpdates when View Updates is toggled
  const handleViewUpdatesToggle = () => {
    setViewTab("updates");
  };

  const handleViewPendingToggle = () => {
    setViewTab("pending");
  };

  // Load information into orgs states
  useEffect(() => {
    const fetchAndFilterOrganizations = async () => {
      try {
        // Check if org states are empty, and fetch organizations if needed
        if (allOrgs.length === 0) {
          const fetchedOrgs = await getOrganizations();
          if (fetchedOrgs) {
            setAllOrgs(fetchedOrgs); // Cache orgs for later
            if (fetchedOrgs.length > 0) {
              const filteredUpdatedOrgs =
                await filterOrganizationsWithPendingReimbursements(fetchedOrgs); // Fetch organizations with updates
              setUpdatedOrgs(filteredUpdatedOrgs.filteredOrgs); // Cache orgs for later

              let filteredPendingApprovalOrgs = fetchedOrgs.filter(
                (org) => !org.approved,
              );
              setPendingOrgs(filteredPendingApprovalOrgs); // Cache orgs for later
            }
          }
        }

        let filteredOrgs = [];
        // Set orgs based on viewUpdates and availability of updatedOrgs
        if (viewTab === "updates") {
          filteredOrgs = updatedOrgs; // For displaying orgs with updates
        } else if (viewTab === "pending") {
          filteredOrgs = pendingOrgs;
        } else {
          filteredOrgs = allOrgs; // Otherwise display all orgs
        }

        setOrgs(filteredOrgs);
      } catch (error) {
        console.error("Error fetching and filtering organizations:", error);
      }
    };

    fetchAndFilterOrganizations();
  }, [viewTab]);

  useEffect(() => {
    if (search) {
      const filteredOrgs = allOrgs.filter(
        (org) => org.name.includes(search) || org.clerkUser?.includes(search),
      );
      const filteredUpdatedOrgs = updatedOrgs.filter(
        (org) => org.name.includes(search) || org.clerkUser?.includes(search),
      );
      setOrgs(filteredOrgs);
      setUpdatedOrgs(filteredUpdatedOrgs);
    } else {
      setOrgs(allOrgs);
      setUpdatedOrgs(allUpdatedOrgs);
    }
  }, [search, allOrgs, allUpdatedOrgs, updatedOrgs]);

  if (!isLoaded) {
    return <CenteredSpinner />;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (!user?.publicMetadata?.admin) {
    return router.push("/");
  }

  return (
    <main className="p-10 w-full">
      <h1>
        {/* Page header */}
        <div className="font-sans text-2xl mb-10 font-semibold">
          SPONSORED ORGANZATIONS/PROJECTS
        </div>
      </h1>
      {/* Row of buttons */}
      <div className="w-full flex items-center justify-between mb-10">
        {/* View All / View Updates toggles */}
        <div className="w-full flex items-center justify-between mb-10 relative">
          {/* View All / View Updates toggles */}
          <div className="flex justify-center items-center w-full">
            <div className="flex space-x-4">
              <Toggle
                className="text-lg h-11 rounded-none border px-8 border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white"
                data-state={viewTab === "" ? "on" : "off"}
                onClick={handleViewAllToggle}
              >
                VIEW ALL
              </Toggle>
              <Toggle
                className="text-lg h-11 rounded-none border px-8 border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white"
                data-state={viewTab === "updates" ? "on" : "off"}
                onClick={handleViewUpdatesToggle}
              >
                VIEW UPDATES
                <div className="relative w-7 h-7 ml-3 bg-[#335543] rounded-full flex items-center justify-center text-white text-sm">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Number of updated orgs */}
                    {updatedOrgs.length}
                  </div>
                </div>
              </Toggle>
              <Toggle
                className="text-lg h-11 rounded-none border px-8 border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white"
                data-state={viewTab === "pending" ? "on" : "off"}
                onClick={handleViewPendingToggle}
              >
                VIEW PENDING
              </Toggle>
            </div>
          </div>
          <div className="relative w-72 h-11">
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
        </div>
      </div>

      <style jsx>{`
        .custom-grid {
          display: grid;
          gap: 1.5rem; /* Adjust gap as needed */
          justify-content: center; /* Center the grid horizontally */
          justify-items: center; /* Center the content within each grid item */
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        @media (min-width: 875px) {
          .custom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1175px) {
          .custom-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1475px) {
          .custom-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="px-8 max-w-[1300px] mx-auto flex justify-center">
        <div className="custom-grid">
          {orgs.map((organization, index) => (
            <div key={index}>
              <SponsorCard
                organizationData={organization}
                email="temp@domain.com"
                toApprove={organization.approved === false}
                updates={updateCount[organization.clerkUser] || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
