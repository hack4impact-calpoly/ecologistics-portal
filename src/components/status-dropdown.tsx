"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Status from "@/lib/enum";

export function StatusDropdown({
  currentStatus,
  onChange,
}: {
  currentStatus: Status;
  onChange: (input: string) => void;
}) {
  // Note this component will need to update the status in the database
  const [status, setStatus] = useState<string>(currentStatus || "");

  // prettier-ignore
  const statusColors: { [key: string]: string } = {
    "Paid": "bg-[#E0F5EC] color-[#105631]",
    "Pending": "bg-[#D4EAFF] color-[#0D4F90]",
    "On Hold": "bg-[#FCEFE1] color-[#996127]",
    "Declined": "bg-[#F6E0E1] color-[#9C2C30]",
    "": "",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mx-4 mx-2">
        <Button variant="outline" className={statusColors[status]}>
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            onChange(value);
          }}
        >
          <DropdownMenuRadioItem value={Status.Pending}>
            Pending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.NeedsReview}>
            Needs Review
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.Paid}>
            Paid
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.OnHold}>
            On Hold
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.Declined}>
            Declined
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
