"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/centered-spinner";
import SponsoredHomePage from "../components/sponsored-org/sponsored-org-home";
import AdminHomePage from "../components/admin-home-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FullscreenSpinner from "@/components/fullscreen-spinner";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <FullscreenSpinner />;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (user?.publicMetadata?.admin) {
    return <AdminHomePage />;
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
          <div className="flex items-center justify-center mx-auto">
            <Alert className="text-center p-8 text-lg">
              <AlertTitle className="text-2xl mb-4">Pending Approval</AlertTitle>
              <AlertDescription className="text-xl">
                Your organization is pending review from an Ecologistics administrator.
              </AlertDescription>
            </Alert>
          </div>
        );
      }
    }
  }
}
