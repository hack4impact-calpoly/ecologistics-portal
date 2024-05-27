"use client";

import CenteredSpinner from "@/components/centered-spinner";
import AdminTable from "@/components/admin/admin-table/admin-table";
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
    <main className="px-14 py-12 overflow-y-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-6 items-center mb-4">
          <h1 className="font-bold text-2xl">Reimbursement/Payment Requests</h1>
        </div>
      </div>
      <AdminTable />
    </main>
  );
}
