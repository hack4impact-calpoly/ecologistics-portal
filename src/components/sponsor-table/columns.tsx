"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  request: string;
  requestFor: string;
  amount: number;
  status: "paid" | "on hold" | "declined" | "pending";
  requestDate: Date;
  receipt: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "request",
    header: "Request",
  },
  {
    accessorKey: "requestFor",
    header: "Request For",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("requestDate");
      const formatted = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return formatted;
    },
  },
  {
    accessorKey: "receipt",
    header: "Receipt",
  },
];
