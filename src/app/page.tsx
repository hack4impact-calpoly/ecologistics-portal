import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ReimbursementRequestsTable from "@/components/reimbursement-table/table";

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl="/"></UserButton>
      <h1>Home</h1>
      <ReimbursementRequestsTable />
    </main>
  );
}
