import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Reimbursement from "@/models/reimbursement";
import StatusBadge from "./status-badge";
import Status from "@/lib/enum";

export default function RequestInfoCard(props: Reimbursement) {
  const getStatus = (status: string) => {
    switch (status) {
      case "Paid":
        return Status.Paid;
      case "Pending":
        return Status.Pending;
      case "On Hold":
        return Status.OnHold;
      case "Declined":
        return Status.Declined;
      case "Needs Review":
        return Status.NeedsReview;
      default:
        return Status.OnHold;
    }
  };

  return (
    // Entire Card
    <Card className="border-none shadow-none">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[30px]">{props.reportName}</CardTitle>
          <StatusBadge reimbursementStatus={getStatus(props.status)} />
        </div>
        <CardDescription className="flex items-center space-x-6">
          <div className="px-4 py-[8px] border-[1.5px] border-black rounded-full text-black font-bold text-[16px]">
            ${props.amount}
          </div>
          <div className="text-gray-600 text-[16px]">
            {new Date(props.transactionDate).toLocaleDateString()}
          </div>
        </CardDescription>
      </CardHeader>
      {/* Description, recipient info, and image */}
      <CardContent>
        <div className="flex flex-col gap-y-4">
          Receipt Description: {props.comment}
          <div className="flex flex-col gap-y-1.5">
            <h5 className="text-[22px]">Request For:</h5>
            <div className="flex flex-col gap-y-1">
              <div className="flex gap-x-6">
                <p>{props.recipientName}</p>
                <p>{props.recipientEmail}</p>
              </div>
              <div className="flex gap-x-4">
                <p>Payment Type Info:</p>
                <p className="italic">{props.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[607px] h-[380px] justify-center mt-6">
          <Image
            src={props.receiptLink}
            width={607}
            height={380}
            alt="Receipt Picture"
            className="border border-blue-400 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
