import React, { useState } from "react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Reimbursement from "@/database/reimbursement-schema";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import RequestInfoCard from "@/components/sponsored-org/request-info-card";
import StatusBadge from "@/components/status-badge";

const ReportNameCell = ({ row }: { row: any }) => {
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);

  const handleTitleClick = () => {
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

  return (
    <Dialog>
      <DialogTrigger>
        <div className="capitalize" onClick={handleTitleClick}>
          {row.getValue("reportName")}
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[700px]">
        <div>
          {selectedReimbursement ? (
            <RequestInfoCard {...selectedReimbursement} />
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
    accessorKey: "reportName",
    header: "Request",
    cell: ({ row }) => <ReportNameCell row={row} />,
  },
  {
    accessorKey: "recipientName",
    header: "Request For",
    cell: ({ row }) => <div className="capitalize">{row.getValue("recipientName")}</div>,
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
      <div className="capitalize">
        <StatusBadge reimbursementStatus={row.getValue("status")} />
      </div>
    ),
  },
  {
    accessorKey: "transactionDate",
    header: "Request Date",
    filterFn: "dateFilterFn" as FilterFnOption<Reimbursement>,
    cell: ({ row }) => {
      // const date: Date = row.getValue("transactionDate");
      const datePart = (row.getValue("transactionDate") as string)?.slice(0, 10);
      const date = new Date(datePart);
      return date.toLocaleDateString();
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
