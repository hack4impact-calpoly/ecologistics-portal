import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatAmount } from "@/lib/format";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { DownloadIcon } from "@radix-ui/react-icons";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { useState } from "react";
import HelpMenu from "../../help-menu";
import ManageRequestCard from "../manage-request-card";
import { ReimbursementWithOrganization } from "./admin-table";

const OrganizationCell = ({ row }: { row: any }) => {
  const [selectedReimbursement, setSelectedReimbursement] = useState<ReimbursementWithOrganization | null>(null);

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
      .then(async (data) => ({
        ...data,
        organization: row.original.name,
      }))
      .then((data) => {
        if (data) {
          setSelectedReimbursement(data);
        }
      });
  };
  const updateStatus = (status: string) => {
    const reimbursementId = row.original._id;
    fetch(`/api/reimbursement/${reimbursementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
        fetchReimbursementInfo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateComment = (comment: string) => {
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
        {selectedReimbursement ? (
          <>
            <ManageRequestCard
              reimbursement={selectedReimbursement}
              updateComment={updateComment}
              updateStatus={updateStatus}
            />
          </>
        ) : (
          <p>Loading reimbursement information...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<ReimbursementWithOrganization>[] = [
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
    cell: ({ row }) => <div className="capitalize">{row.getValue("recipientName")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <div className="capitalize">{formatAmount(row.getValue("amount"))}</div>,
  },
  {
    accessorKey: "transactionDate",
    header: "Expense Date",
    filterFn: "dateFilterFn" as FilterFnOption<ReimbursementWithOrganization>,
    cell: ({ row }) => (
      <div className="capitalize">
        {(() => {
          const datePart = (row.getValue("transactionDate") as string)?.slice(0, 10);
          const date = new Date(datePart);
          return date.toLocaleDateString();
        })()}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Type",
    cell: ({ row }) => <div className="capitalize ">{row.getValue("paymentMethod")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="p-0">
            <StatusBadge reimbursementStatus={row.getValue("status")} />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <HelpMenu />
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    accessorKey: "receiptLink",
    header: "Receipt",
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        <Button
          onClick={() => {
            window.open(row.getValue("receiptLink"), "_blank");
          }}
          className="p-0 px-4"
          variant={"ghost"}
        >
          <DownloadIcon />
        </Button>
      </div>
    ),
  },
];
