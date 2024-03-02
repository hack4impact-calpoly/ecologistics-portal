"use client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import SponsorCard from "@/components/sponsored-org-card";
import Organization from "@/database/organization-schema";
import { Types } from "mongoose";
import { useEffect, useState } from "react";

// Example sponsors for testing
const organizations: Organization[] = [
  {
    name: "Organization 1",
    description: "Placeholder description",
    website: "https://organization1.com",
    clerkUser: "User 1",
    logo: "/images/sponsored_org_profile_picture_placeholder.png",
    reimbursements: [new Types.ObjectId("65c97b4056e2e2d7d225fe70")],
    status: "active",
  },
  {
    name: "Organization 2",
    description: "Placeholder description",
    website: "https://organization2.com",
    clerkUser: "User 2",
    logo: "/images/sponsored_org_profile_picture_placeholder.png",
    reimbursements: [],
    status: "active",
  },
  {
    name: "Organization 3",
    description: "Placeholder description",
    website: "https://organization3.com",
    clerkUser: "User 3",
    logo: "/images/sponsored_org_profile_picture_placeholder.png",
    reimbursements: [new Types.ObjectId("65c97b4056e2e2d7d225fe70")],
    status: "active",
  },
  {
    name: "Organization 4",
    description: "Placeholder description",
    website: "https://organization4.com",
    clerkUser: "User 4",
    logo: "/images/sponsored_org_profile_picture_placeholder.png",
    reimbursements: [],
    status: "active",
  },
  {
    name: "Organization 5",
    description: "Placeholder description",
    website: "https://organization5.com",
    clerkUser: "User 5",
    logo: "/images/sponsored_org_profile_picture_placeholder.png",
    reimbursements: [new Types.ObjectId("65c97b4056e2e2d7d225fe70")],
    status: "active",
  },
];

// Helper function to retrieve a list of organizations with pending reimbursements
async function filterOrganizationsWithPendingReimbursements(
  organizations: Organization[],
) {
  const filteredOrgs: Organization[] = [];
  // Check each organization
  for (const org of organizations) {
    let pending = false;
    for (const reimbursementId of org.reimbursements) {
      // Fetch reimbursement from API
      const reimbursement = await getReimbursement(reimbursementId.toString());
      // Check if reimbursement has a pending status
      if (reimbursement && reimbursement.status === "Pending") {
        pending = true;
        break; // If it has at least one pending reimbursement, no need to keep checking the same organization
      }
    }
    // Add organization to list if it had a pending reimbursement
    if (pending) {
      filteredOrgs.push(org);
    }
  }
  return filteredOrgs;
}

// Fetch reimbursement info from API
async function getReimbursement(reimbursementId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/reimbursement/${reimbursementId}`, // Replace with official API route
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
  const [viewUpdates, setViewUpdates] = useState(false); // State for view updates toggle
  const [orgs, setOrgs] = useState<Organization[]>([]); // State for currently displayed organizations based on view settings
  const [updatedOrgs, setUpdatedOrgs] = useState<Organization[]>([]); // State for organizations with pending updates (filtered)
  const [allOrgs, setAllOrgs] = useState<Organization[]>([]); // State for all organizations (unfiltered)

  // Turn off viewUpdates when View All is toggled
  const handleViewAllToggle = () => {
    setViewUpdates(false);
  };

  // Turn on viewUpdates when View Updates is toggled
  const handleViewUpdatesToggle = () => {
    setViewUpdates(true);
  };

  // Load information into orgs states
  useEffect(() => {
    const fetchAndFilterOrganizations = async () => {
      try {
        let filteredOrgs: Organization[] = [];

        // Check if org states are empty, and fetch organizations if needed
        if (allOrgs.length === 0) {
          const fetchedOrgs = organizations; // Replace with proper API fetch
          setAllOrgs(fetchedOrgs); // Cache orgs for later

          if (fetchedOrgs.length > 0) {
            const filteredUpdatedOrgs =
              await filterOrganizationsWithPendingReimbursements(fetchedOrgs); // Fetch organizations with updates
            console.log(filteredUpdatedOrgs);
            setUpdatedOrgs(filteredUpdatedOrgs); // Cache orgs for later
          }
        }

        // Set orgs based on viewUpdates and availability of updatedOrgs
        if (viewUpdates) {
          filteredOrgs = updatedOrgs; // For displaying orgs with updates
        } else {
          filteredOrgs = allOrgs; // Otherwise display all orgs
        }

        setOrgs(filteredOrgs);
      } catch (error) {
        console.error("Error fetching and filtering organizations:", error);
      }
    };

    fetchAndFilterOrganizations();
  });

  return (
    <main className="p-10 w-full">
      <h1>
        {/* Page header */}
        <div className="font-sans text-3xl mb-10">
          SPONSORED ORGANZATIONS/PROJECTS
        </div>
      </h1>
      {/* Row of buttons */}
      <div className="w-full flex items-center justify-between mb-10">
        {/* Add New Org Button */}
        <Button className="w-44 h-11 bg-[#F18030] hover:bg-orange-400 text-white drop-shadow-md">
          + Add New Org
        </Button>
        {/* View All / View Updates toggles */}
        <div>
          <Toggle
            className="text-lg h-11 rounded-none border px-8 border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white"
            data-state={!viewUpdates ? "on" : "off"}
            onClick={handleViewAllToggle}
          >
            VIEW ALL
          </Toggle>
          <Toggle
            className="text-lg h-11 rounded-none border px-8 border-[#335543] text-[#335543] data-[state=on]:bg-[#335543] data-[state=on]:text-white"
            data-state={viewUpdates ? "on" : "off"}
            onClick={handleViewUpdatesToggle}
            value="view-update"
          >
            VIEW UPDATES
            <div className="relative w-7 h-7 ml-3 bg-[#335543] rounded-full flex items-center justify-center text-white text-sm">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* Number of updated orgs */}
                {updatedOrgs.length}
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
      {/* Modify mr and ml to align cards to horizontal edge of flex box */}
      <div className="flex flex-wrap justify-start mr-[-8px] ml-[-8px]">
        {orgs.map((organization, index) => (
          // Modify w to fit desired amount of cards in one row
          <div key={index} className="w-1/5 p-2">
            <SponsorCard
              image={organization.logo || ""}
              organization={organization.name}
              user={organization.clerkUser}
              email="temp@domain.com"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
