import { formatAmount } from "@/utils/format";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

export type Reimbursement = {
  organization: string;
  reportName: string;
  recipientName: string;
  recipientEmail: string;
  transactionDate: Date;
  amount: number;
  paymentMethod: string;
  purpose: string;
  receiptLink: string;
  status: string;
  documents: string;
};

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: "recipientEmail",
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger>
          <div className="capitalize">{row.getValue("organization")}</div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="border">popover content</div>
        </PopoverContent>
      </Popover>
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
