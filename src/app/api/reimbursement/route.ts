import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
// import { NextApiRequest, NextApiResponse } from "next";
import Reimbursement from "@/database/reimbursement-schema";
import Status from "@/lib/enum";

export type CreateReimbursementBody = Reimbursement;

export type GetReimbursementsResponse = Reimbursement[];
export type CreateReimbursementResponse = Reimbursement;

import { imageUpload } from "@/services/image-upload";
//Get all Reimbursements
export async function GET() {
  await connectDB();
  try {
    const reimbursements: GetReimbursementsResponse =
      await Reimbursement.find();
    return NextResponse.json(reimbursements);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Error fetching reimbursements",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

//Post Reimbursement
export async function POST(req: NextRequest) {
  await connectDB();
  //validate input
  try {
    const reuqestData = await req.formData();
    if (!reuqestData) {
      const errorResponse: ErrorResponse = {
        error: "No Body in Post Req",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const link = await imageUpload(reuqestData.get("file"), "reimbursment");

    console.log(link);

    // interface Reimbursement {
    //   organization: Types.ObjectId;
    //   reportName: string;
    //   recipientName: string;
    //   recipientEmail: string;
    //   transactionDate: Date;
    //   amount: number;
    //   paymentMethod: string;
    //   purpose: string;
    //   receiptLink: string;
    //   status: string;
    //   comment?: string;
    // }

    const reimburse: CreateReimbursementBody = await new Reimbursement({
      organization: "60b3c8b3c9e7b40015b9b2e4",
      reportName: reuqestData.get("reportName") as string,
      recipientName: reuqestData.get("recipientName") as string,
      recipientEmail: reuqestData.get("recipientEmail") as string,
      transactionDate: reuqestData.get("transactionDate") as Date,
      amount: reuqestData.get("amount") as number,
      paymentMethod: reuqestData.get("paymentMethod") as string,
      purpose: reuqestData.get("purpose") as string,
      receiptLink: link,
      status: Status.Pending,
    }).save();
    return NextResponse.json(reimburse);
    // res.status(201).json(reimbursement);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Post Failed",
    };
    console.log(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
