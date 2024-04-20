import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Reimbursement from "@/database/reimbursement-schema";

export default function RequestInfoCard(props: Reimbursement) {
  return (
    // Entire Card
    <Card className="w-full rounded-2xl p-4">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{props.reportName}</CardTitle>
          {props.status}
        </div>
        <CardDescription className="flex space-x-4">
          <div>${props.amount}</div>
          <div>{new Date(props.transactionDate).toLocaleDateString()}</div>
        </CardDescription>
      </CardHeader>
      {/* Description, recipient info, and image */}
      <CardContent>
        <div>
          Receipt Description: {props.comment}
          <br></br>
          Request For:<br></br>
          {props.recipientName} &nbsp;
          {props.recipientEmail}
        </div>
        <div className="flex justify-center">
          <Image
            src={props.receiptLink}
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
