"use client";
import AdminTable from "@/components/admin-table/admin-table";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/centered-spinner";
import SponsoredHomePage from "../components/sponsored-org-home";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <CenteredSpinner />;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (user?.publicMetadata?.admin) {
    return (
      <main>
        <h1 className="text-xl font-bold">Nonprofit Name</h1>
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
        return <SponsoredHomePage />;
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
