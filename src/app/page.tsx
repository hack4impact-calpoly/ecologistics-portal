"use client";
import ReimbursementCard from "@/components/reimbursement-card";
import AdminTable from "@/components/admin-table/admin-table";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import { data } from "@/test/mock-data";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return redirect("/sign-in");
  }
  if (user?.publicMetadata?.admin) {
    return (
      <main>
        <h1 className="text-xl font-bold">Nonprofit Name</h1>
        <AdminTable />
        {/* <SponsoredOrgTable /> */}
        {/* <ReimbursementCard
          {...data[0]}
          receiptLink="https://legaltemplates.net/wp-content/uploads/receipt-template.png"
        /> */}
      </main>
    );
  } else {
    if (!user?.unsafeMetadata?.organization) {
      redirect("/setup-organization");
    } else {
      if (
        (
          user?.unsafeMetadata?.organization as {
            name: string;
            description: string;
            website: string;
            approved: boolean;
          }
        ).approved
      ) {
        return (
          <main>
            <SponsoredOrgTable />
          </main>
        );
      } else {
        return <div>Pending approval</div>;
      }
    }
  }
}
