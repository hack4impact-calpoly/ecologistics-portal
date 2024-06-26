import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Organization } from "@/database/organization-schema";
import { OrganizationWithUser } from "@/app/sponsored-organizations/page";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export interface SponsoredOrgCardProps {
  organizationData: OrganizationWithUser;
  updates?: number;
  toApprove: boolean;
}

const updateOrg = (orgData: OrganizationWithUser, approve: Boolean) => {
  if (approve) {
    fetch(`/api/user/${orgData.clerkUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unsafeMetadata: { organization: { approved: true } },
      }),
    })
      .then((response) => {
        window.location.reload();
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    fetch(`/api/user/${orgData.clerkUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unsafeMetadata: { organization: null } }),
    })
      .then((response) => {
        window.location.reload();
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default function SponsoredOrgCard({ organizationData, toApprove, updates }: SponsoredOrgCardProps) {
  // console.log(organization, " Updates:" + updates);
  return (
    <Card className="w-full h-72 relative min-w-[300px] max-w-[300px] shadow-md rounded-2xl">
      {toApprove && (
        <div className="flex flex-row absolute top-2 right-2">
          <CheckIcon
            className="h-6 w-6 cursor-pointer"
            style={{ color: "green" }}
            onClick={() => {
              updateOrg(organizationData, true);
              console.log("clicked check");
            }}
          />
          <Cross2Icon
            className="h-6 w-6 cursor-pointer"
            style={{ color: "red" }}
            onClick={() => {
              updateOrg(organizationData, false);
              console.log("clicked x");
            }}
          />
        </div>
      )}
      <CardHeader className="pt-8 pl-4 pr-4 flex flex-row">
        <div className="w-20 h-20 relative">
          <Image
            className="object-cover rounded-full"
            src={organizationData?.logo || "/images/sponsored_org_profile_picture_placeholder.png"}
            layout="fill"
            alt="sponsored org logo"
          />
        </div>
        <div className="flex flex-col ml-3 justify-center">
          <CardTitle className="mt-0 font-medium text-base whitespace-normal break-words">
            {organizationData?.name}
          </CardTitle>
          {!!updates && updates > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CardDescription className="mt-1 px-3 py-1 bg-[#335543] rounded-[20px] text-white">
                    {updates === 1 ? `${updates} Update` : `${updates} Updates`}
                  </CardDescription>
                </TooltipTrigger>
                <TooltipContent>
                  Organization has {updates} pending request
                  {updates === 1 ? "" : "s"}.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 pl-9 pr-3 space-y-3">
        <div className="grid grid-cols-6 h-7 content-center">
          <Image
            className="col-span-1 self-center"
            src={"/images/sponsored_org_card_icon _user_.png"}
            width={18}
            height={18}
            alt="mail"
          />
          <p className="col-span-5 font-semibold text-sm self-center whitespace-normal break-words">
            {organizationData?.clerkUserName}
          </p>
        </div>
        <div className="grid grid-cols-6 h-7 ">
          <Image
            className="col-span-1 self-center"
            src={"/images/sponsored_org_card_icon _mail_.png"}
            width={18}
            height={18}
            alt="mail"
          />
          <p className="col-span-5 font-semibold text-sm self-center whitespace-normal break-words">
            {organizationData?.clerkUserEmail}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
