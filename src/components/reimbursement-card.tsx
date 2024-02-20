import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Reimbursement from "@/database/reimbursement-schema";

export default function ReimbursementCard(prop: Reimbursement) {
  return (
    // Entire Card
    <Card className="w-2/5 rounded-2xl p-4">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{prop.reportName}</CardTitle>
          {prop.status}
        </div>
        <CardDescription className="flex space-x-4">
          <div>${prop.amount}</div>
          <div>{prop.transactionDate.toLocaleDateString()}</div>
        </CardDescription>
      </CardHeader>
      {/* Description, recipient info, and image */}
      <CardContent>
        <div>
          Receipt Description: {prop.comment}
          <br></br>
          Request For:<br></br>
          {prop.recipientName} &nbsp;
          {prop.recipientEmail}
        </div>
        <div className="flex justify-center">
          <Image
            src={prop.receiptLink}
            width={500}
            height={500}
            alt="Receipt Picture"
            className="border border-blue-400 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
