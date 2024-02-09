import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

// Temporary Reimbursement type
// Will later use Reimbursement schema
export type ReimbursementInfo = {
  title: string;
  status: string;
  amount: number;
  date: Date;
  description: string;
  recipientName: string;
  recipientEmail: string;
  receiptImage: string;
};

export default function ReimbursementCard(prop: ReimbursementInfo) {
  return (
    // Entire Card
    <Card className="w-2/5 rounded-2xl p-4">
      {/* Title, status, amount, and date */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{prop.title}</CardTitle>
          {prop.status}
        </div>
        <CardDescription className="flex space-x-4">
          <div>${prop.amount}</div>
          <div>{prop.date.toLocaleDateString()}</div>
        </CardDescription>
      </CardHeader>
      {/* Description, recipient info, and image */}
      <CardContent>
        <div>
          Receipt Description: {prop.description}
          <br></br>
          Request For:<br></br>
          {prop.recipientName} &nbsp;
          {prop.recipientEmail}
        </div>
        <div className="flex justify-center">
          <Image
            src={prop.receiptImage}
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
