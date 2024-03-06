import { formatAmount } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Reimbursement from "@/database/reimbursement-schema";
import { Types } from "mongoose";

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: "recipientEmail",
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger>
          <div className="capitalize">
            {/* TODO: causes hydration error due to client rendering a different ObjectId than server */}
            {/* should be fixed when we are rendering organization name instead of id */}
            {/* {row.getValue<Types.ObjectId>("organization").toString()} */}
            test org
          </div>
        </DialogTrigger>
        <DialogContent>
          <div className="border">dialog content</div>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "reportName",
    header: "Recipient",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("reportName")}</div>
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
      <div className="capitalize">
        <Badge>{row.getValue("status")}</Badge>
      </div>
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
