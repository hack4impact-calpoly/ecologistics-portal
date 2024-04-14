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
import { useEffect, useState } from "react";

export default function ManageRequestCard(
  props: Reimbursement & { reimbursementId: string },
) {
  const [comment, setComment] = useState("");

  const addComment = () => {
    fetch(`/api/reimbursement/${props.reimbursementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: props.comment + comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    // Entire Card
    <Card className="w-full rounded-2xl p-4">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{props.reportName}</CardTitle>
          <StatusDropdown Status={props.status.toString()} />{" "}
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
          <br></br>
          {/* ssing payment type info from database? */}
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
          <Textarea
            placeholder="Additional comments"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button className="mt-2" onClick={() => addComment()}>
            Update Comments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
