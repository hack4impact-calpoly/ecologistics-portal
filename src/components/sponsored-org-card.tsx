import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Organization } from "@/database/organization-schema";

export interface SponsoredOrgCardProps {
  organizationData: Organization;
  email: string;
  updates?: number;
  toApprove: boolean;
}

const updateOrg = (orgData: Organization, approve: Boolean) => {
  let updatedOrg = orgData as any;

  if (approve) {
    updatedOrg.approved = true;
    if (updatedOrg.hasOwnProperty("clerkUser")) {
      delete updatedOrg["clerkUser"];
    }
    fetch(`/api/user/${orgData.clerkUser}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organization: updatedOrg }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  } else {
    fetch(`/api/user/${orgData.clerkUser}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organization: null }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }
};

export default function SponsoredOrgCard({
  organizationData,
  email,
  toApprove,
  updates,
}: SponsoredOrgCardProps) {
  // console.log(organization, " Updates:" + updates);
  return (
    <Card className="w-full h-72 relative">
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
        <Image
          className="object-cover rounded-full col-span-3"
          src={organizationData?.logo || ""}
          width={80}
          height={80}
          alt="sponsored org logo"
        />
        <CardTitle className="col-span-5 ml-3 mt-0 font-medium text-base">
          {organizationData?.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 pl-9 pr-3 space-y-3">
        {updates! > 0 && (
          <span className="p-[8px_12px_8px_12px] bg-[#335543] rounded-[20px] text-white">
            {updates === 1 ? `${updates} UPDATE` : `${updates} UPDATES`}
          </span>
        )}{" "}
        <div className="grid grid-cols-6 h-7 content-center">
          <Image
            className="col-span-1 self-center"
            src={"/images/sponsored_org_card_icon _user_.png"}
            width={18}
            height={18}
            alt="mail"
          />
          <p className="col-span-5 font-semibold text-sm self-center">
            {organizationData?.clerkUser}
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
          <p className="col-span-5 font-semibold text-sm self-center">
            {email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
