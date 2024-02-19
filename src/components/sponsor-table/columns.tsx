import { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Reimbursement from "@/database/reimbursement-schema";

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: "reportName",
    header: "Request",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("reportName")}</div>
    ),
  },
  {
    accessorKey: "recipientName",
    header: "Request For",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("recipientName")}</div>
    ),
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "transactionDate",
    header: "Request Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("transactionDate");
      const formatted = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return formatted;
    },
  },
  {
    accessorKey: "receiptLink",
    header: "Receipt",
    cell: ({ row }) => (
      <div>
        <Button className="p-0 px-4" variant={"ghost"}>
          <DownloadIcon />
        </Button>
      </div>
    ),
  },
];
