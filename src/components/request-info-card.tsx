import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Reimbursement from "@/database/reimbursement-schema";
import StatusBadge from "./status-badge";

export default function RequestInfoCard(props: Reimbursement) {
  return (
    // Entire Card
    <Card className="w-[700px] rounded-2xl p-8">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[30px]">{props.reportName}</CardTitle>
          <StatusBadge reimbursementStatus={props.status} />
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
        <div className="flex justify-center mt-6">
          <Image
            src={props.receiptLink}
            width={564}
            height={340}
            alt="Receipt Picture"
            className="border border-blue-400 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
