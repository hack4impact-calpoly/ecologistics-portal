import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusDropdown } from "./status-dropdown";
import Image from "next/image";
import Reimbursement from "@/database/reimbursement-schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ManageRequestCard(props: Reimbursement) {
  return (
    // Entire Card
    <Card className="m-5 w-2/5 rounded-2xl p-4">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{props.reportName}</CardTitle>
          <StatusDropdown Status={props.status.toString()} />{" "}
        </div>
        <CardDescription className="flex space-x-4">
          <div>${props.amount}</div>
          <div>{props.transactionDate.toLocaleDateString()}</div>
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
          <br></br>
          {/* missing payment type info from database? */}
          Payment Type Info: {props.paymentMethod}
        </div>
        <div className="flex justify-center mt-[10px]">
          <Image
            src={props.receiptLink}
            width={500}
            height={500}
            alt="Receipt Picture"
            className="border border-blue-400 w-full"
          />
        </div>
        <div className="mt-5">
          <Textarea placeholder="Additional comments" />
          <Button className="mt-2">Update Comments</Button>
        </div>
      </CardContent>
    </Card>
  );
}
