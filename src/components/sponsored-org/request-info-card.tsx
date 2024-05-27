import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Reimbursement from "@/database/reimbursement-schema";
import StatusBadge from "../status-badge";
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
    <Card className="w-full rounded-2xl border-none">
      {/* Title, status, amount, and date */}
      <CardHeader className="flex flex-row justify-between items-top pb-3">
        <div className="flex flex-col items-left">
          <CardTitle className="text-xxl font-bold pb-3">
            <p className="text-wrap text-ellipsis overflow-hidden max-w-[16rem]">{props.reportName}</p>
          </CardTitle>
          <StatusBadge reimbursementStatus={getStatus(props.status)} />
        </div>
        <CardDescription className="flex space-x-4 items-center text-black">
          <div className="border border-black rounded-full py-1 px-3">${props.amount}</div>
          <div>{new Date(props.transactionDate).toLocaleDateString()}</div>
        </CardDescription>
      </CardHeader>
      {/* Description, recipient info, and image */}
      <CardContent className="space-y-1">
        <p className="text-sm pb-5 text-wrap text-ellipsis overflow-hidden">
          Request Description: {props.purpose}
          <br></br>
          {props.comment}
        </p>
        <p className="text-base">
          Request For:<br></br>
        </p>
        <p className="text-sm pb-4 text-wrap text-ellipsis overflow-hidden">
          {props.recipientName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.recipientEmail}
          <br></br>
          Payment Type Info:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.paymentMethod ?? "No Input"}
        </p>
        <div className="flex justify-center mt-[10px] max-w-[564px] max-h-[340px]">
          <Image
            src={props.receiptLink}
            width={564}
            height={340}
            alt="Receipt Picture"
            className="border border-gray-100 w-full object-scale-down object-center hover:cursor-pointer"
            onClick={() => {
              window.open(props.receiptLink, "_blank");
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
