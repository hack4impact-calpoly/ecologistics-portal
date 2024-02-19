import { formatAmount } from "@/utils/format";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Reimbursement from "@/database/reimbursementSchema";

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
          <div className="capitalize">{row.getValue("organization")}</div>
        </DialogTrigger>
        <DialogContent>
          <div className="border">popover content</div>
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
        {(row.getValue("transactionDate") as Date).toLocaleDateString()}
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
