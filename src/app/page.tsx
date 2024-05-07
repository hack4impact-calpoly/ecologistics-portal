"use client";
import AdminTable from "@/components/admin-table/admin-table";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/centered-spinner";
import Popup from "@/components/user-info-popup";
import Admin from "@/components/admin";

type organizationInfo = {
  name: string;
  description: string;
  website: string;
  approved: boolean;
};

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return (
      <div>
        <CenteredSpinner />{" "}
      </div>
    );
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (user?.publicMetadata?.admin) {
    return (
      <main className="mx-5 my-4 w-full">
        <h2 className="text-[26px] font-[600] leading-none text-black mb-5">
          Reimbursment Requests
        </h2>
        <AdminTable />
      </main>
    );
  } else {
    if (!user?.unsafeMetadata?.organization) {
      router.push("/setup-organization");
    } else {
      if (
        (
          user?.unsafeMetadata?.organization as {
            name: string;
            description: string;
            website: string;
            approved: boolean;
          }
        )?.approved
      ) {
        const orgInfo = user?.unsafeMetadata?.organization as organizationInfo;
        return (
          <main>
            <Popup
              name={orgInfo.name}
              description={orgInfo.description}
              website={orgInfo.website}
              email={(user?.primaryEmailAddress?.emailAddress as string) || ""}
              user={(user?.fullName as string) || ""}
            />
            <SponsoredOrgTable />
          </main>
        );
      } else {
        return (
          <>
            <div>Pending approval</div>
          </>
        );
      }
    }
  }
}
