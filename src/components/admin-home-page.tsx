"use client";

import CenteredSpinner from "@/components/centered-spinner";
import AdminTable from "@/components/admin-table/admin-table";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <CenteredSpinner />
      </div>
    );
  }
  if (!isSignedIn) {
    router.push("/sign-in");
    return;
  }
  if (!user?.publicMetadata?.admin) {
    router.push("/");
    return;
  }

  return (
    <main className="flex flex-col w-full items-center">
      <div className="w-[calc(95vw-81px)] text-[1.5rem] font-bold mt-10 mb-6">
        Reimbursement/Payment Requests
      </div>
      <AdminTable />
    </main>
  );
}
