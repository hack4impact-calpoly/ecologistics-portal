"use client";
import ReimbursementCard from "@/components/reimbursement-card";
import AdminTable from "@/components/admin-table/admin-table";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import { data } from "@/test/mock-data";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }
  if (!user?.publicMetadata?.admin) {
    return <div>Unauthorized</div>;
  }
  return (
    <main>
      <AdminTable />
      {/* <SponsoredOrgTable /> */}
      {/* <ReimbursementCard
        {...data[0]}
        receiptLink="https://legaltemplates.net/wp-content/uploads/receipt-template.png"
      /> */}
    </main>
  );
}
