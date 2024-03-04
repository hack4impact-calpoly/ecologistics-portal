"use client";
import AdminTable from "@/components/admin-table/admin-table";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { imageUpload } from "@/services/image-upload";

const uploadImageTest = async () => {
  const file = new File([""], "sponsored_org_profile_picture_placeholder.png", {
    type: "image/png",
  });
  const url = await imageUpload(file, "test");
  console.log(url);
};

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (user?.publicMetadata?.admin) {
    return (
      <main>
        <h1 className="text-xl font-bold">Nonprofit Name</h1>
        <AdminTable />
        <Button onClick={uploadImageTest}>Upload Image</Button>
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
