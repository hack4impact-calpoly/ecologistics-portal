import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export interface SponsorCardProps {
  image: string;
  organization: string;
  user: string;
  email: string;
}

export default function SponsorCard({
  image,
  organization,
  user,
  email,
}: SponsorCardProps) {
  return (
    <Card className="w-72 h-72">
      <CardHeader className="pt-8 pl-4 pr-4 flex flex-row">
        <Image
          className="object-cover rounded-full col-span-3"
          src={image}
          width={80}
          height={80}
          alt="sponsor logo"
        />
        <CardTitle className="col-span-5 ml-3 mt-0 font-medium text-base">
          {organization}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pl-9 pr-3 space-y-3">
        <div className="grid grid-cols-6 h-7 content-center">
          <Image
            className="col-span-1 self-center"
            src={"/images/sponsor_card_icon _user_.png"}
            width={18}
            height={18}
            alt="mail"
          />
          <p className="col-span-5 font-semibold text-sm self-center">{user}</p>
        </div>
        <div className="grid grid-cols-6 h-7 ">
          <Image
            className="col-span-1 self-center"
            src={"/images/sponsor_card_icon _mail_.png"}
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
