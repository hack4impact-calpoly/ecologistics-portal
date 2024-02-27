import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ReimbursementRequestsTable from "@/components/reimbursement-table/table";
import SponsorTable from "@/components/sponsor-table/sponsor-table";
import OrgSetup from "@/components/org-setup";

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl="/"></UserButton>
      <h1>Home</h1>
      {/* <ReimbursementRequestsTable /> */}
      <SponsorTable />
      <OrgSetup />
    </main>
  );
}
