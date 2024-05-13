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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default function ManageRequestCard(
  props: Reimbursement & { updateComment: (input: string) => void },
) {
  const [comment, setComment] = useState(props.comment ?? "");
  const [savedComment, setSavedComment] = useState(props.comment ?? "");

  return (
    <Card className="w-full rounded-2xl border-none">
      <CardHeader className="flex flex-row justify-between items-top pb-3">
        <div className="flex flex-col items-left">
          <CardTitle className="text-xxl font-bold pb-3">
            <p className="text-wrap text-ellipsis overflow-hidden max-w-[16rem]">
              {props.reportName}
            </p>
          </CardTitle>
          <CardDescription className="flex space-x-4 items-center text-black">
            <div className="border border-black rounded-full py-1 px-3">
              ${props.amount}
            </div>
            <div>{new Date(props.transactionDate).toLocaleDateString()}</div>
          </CardDescription>
        </div>
        <div className="flex flex-col w-[9rem]">
          <StatusDropdown Status={props.status.toString()} />
          <div className="text-center text-wrap text-ellipsis overflow-hidden">
            {props.comment}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-sm pb-5 text-wrap text-ellipsis overflow-hidden">
          Request Description: {props.purpose}
        </p>
        <p className="text-base">
          Request For:<br></br>
        </p>
        <p className="text-sm pb-4 text-wrap text-ellipsis overflow-hidden">
          {props.recipientName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.recipientEmail}
          <br></br>
          Payment Type Info:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.paymentMethod ? props.paymentMethod : "No Input"}
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <div className="flex justify-center mt-[10px] max-w-[564px] max-h-[340px]">
              <Image
                src={props.receiptLink}
                width={564}
                height={340}
                alt="Receipt Picture"
                className="border border-gray-100 w-full object-cover object-center"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="w-[100%]">
            <Image
              src={props.receiptLink}
              width={564}
              height={340}
              alt="Receipt Picture"
              objectFit=""
              className="border border-gray-100 w-full"
            />
          </DialogContent>
        </Dialog>
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 border-black h-7 px-2" variant="outline">
                <Pencil1Icon className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[100%]">
              <Textarea
                placeholder="Write Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-100 rounded-md p-2"
              />
              <DialogPrimitive.Close className="space-x-4 flex justify-end">
                <Button
                  type="submit"
                  className="border-black h-7 px-2"
                  onClick={() => {
                    props.updateComment(comment);
                    setSavedComment(comment);
                  }}
                >
                  <p className="text-sm">Save</p>
                </Button>
                <Button
                  variant="outline"
                  className="border-black h-7 px-2"
                  onClick={() => {
                    setComment(savedComment);
                  }}
                >
                  <p className="text-sm">Cancel</p>
                </Button>
              </DialogPrimitive.Close>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
