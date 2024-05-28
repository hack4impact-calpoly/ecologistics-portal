import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Reimbursement from "@/database/reimbursement-schema";
import StatusBadge from "../status-badge";
import Status from "@/lib/enum";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const deleteReimbursement = async (id: string) => {
  const res = await fetch(`/api/reimbursement/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete reimbursement");
  }
};

export default function RequestInfoCard(props: Reimbursement & { id: string }) {
  return (
    // Entire Card
    <Card className="w-full rounded-2xl border-none">
      {/* Title, status, amount, and date */}
      <CardHeader className="flex flex-col justify-between items-top pb-3">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xxl font-bold pb-3">
            <p className="text-wrap text-ellipsis overflow-hidden max-w-[16rem]">{props.reportName}</p>
          </CardTitle>
          <div className="txt-xxl">
            <StatusBadge reimbursementStatus={props.status as Status} />
          </div>
        </div>
        <div className="w-[12rem] text-sm text-muted-foreground flex space-x-4 items-center text-black">
          <div className="border border-black rounded-full py-1 px-3">${props.amount}</div>
          <div>{new Date(props.transactionDate).toLocaleDateString()}</div>
        </div>
      </CardHeader>
      {/* Description, recipient info, and image */}
      <CardContent className="space-y-1">
        <p className="text-sm pb-5 text-wrap text-ellipsis overflow-hidden">Request Description: {props.purpose}</p>
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
        <div className="flex justify-center mt-[10px] max-w-[700px] max-h-[340px]">
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
        <div className="w-[38rem] py-2 text-wrap text-ellipsis overflow-hidden">
          Request Comment: {props.comment ?? "No Comment"}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 border-black h-7 px-2 w-full bg-red-400 bg-opacity-80 text-red-800 hover:bg-red-400">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[100%]">
            <DialogTitle>Confirm that you want to delete this Reimbursement Request</DialogTitle>
            <DialogDescription>This action cannot be undone. Click confirm to delete this request.</DialogDescription>
            <DialogPrimitive.Close className="space-x-4 flex flex-col items-center">
              <div className="w-full flex justify-between">
                <Button className="w-[30%]" variant="outline">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="request-reimbursement-form"
                  className="w-[30%] bg-red-400 bg-opacity-80 text-red-800 hover:bg-red-400"
                  onClick={() => {
                    deleteReimbursement(props.id);
                    window.location.reload();
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogPrimitive.Close>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
