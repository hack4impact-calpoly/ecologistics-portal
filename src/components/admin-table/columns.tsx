import { formatAmount } from "@/lib/format";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import Reimbursement from "@/database/reimbursement-schema";
import ManageRequestCard from "../manage-request-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import HelpMenu from "../help-menu";

const OrganizationCell = ({ row }: { row: any }) => {
  const [selectedReimbursement, setSelectedReimbursement] =
    useState<Reimbursement | null>(null);

  useEffect(() => {
    console.log(row.original);
  }, []);

  const fetchReimbursementInfo = () => {
    const reimbursementId = row.original._id;
    fetch(`/api/reimbursement/${reimbursementId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          response.json().then((errorData) => {
            console.error(errorData.error);
          });
        }
      })
      .then((data) => {
        if (data) {
          setSelectedReimbursement(data);
        }
      });
  };

  const updateComment = (comment: String) => {
    const reimbursementId = row.original._id;
    fetch(`/api/reimbursement/${reimbursementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: comment }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchReimbursementInfo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="capitalize" onClick={fetchReimbursementInfo}>
          {row.getValue("organization")}
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="border">
          {selectedReimbursement ? (
            <>
              <ManageRequestCard
                {...selectedReimbursement}
                updateComment={updateComment}
              />
            </>
          ) : (
            <p>Loading reimbursement information...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: "recipientEmail",
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: ({ row }) => <OrganizationCell row={row} />,
  },
  {
    accessorKey: "recipientName",
    header: "Recipient",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("recipientName")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="capitalize">{formatAmount(row.getValue("amount"))}</div>
    ),
  },
  {
    accessorKey: "transactionDate",
    header: "Expense Date",
    filterFn: "dateFilterFn" as FilterFnOption<Reimbursement>,
    cell: ({ row }) => (
      <div className="capitalize">
        {(() => {
          const date = new Date(row.getValue("transactionDate"));
          return date.toLocaleDateString();
        })()}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Type",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("paymentMethod")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">
            <Badge>{row.getValue("status")}</Badge>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <HelpMenu />
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => (
      <div className="w-full flex items-center justify-center">
        <Button className="p-0 px-3" variant={"ghost"}>
          <DownloadIcon />
        </Button>
      </div>
    ),
  },
];
