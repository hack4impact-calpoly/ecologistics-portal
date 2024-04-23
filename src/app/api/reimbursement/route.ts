import connectDB from "@/database/db";
import { ErrorResponse } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";
import Reimbursement from "@/database/reimbursement-schema";
import Status from "@/lib/enum";
import { imageUpload } from "@/services/image-upload";
import { clerkClient } from "@clerk/nextjs";
import Organization from "@/database/organization-schema";

export type CreateReimbursementBody = Reimbursement;

export type GetReimbursementsResponse = Reimbursement[];
export type CreateReimbursementResponse = Reimbursement;

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
  try {
    const requestData = await req.formData();
    //validate input
    if (!requestData) {
      const errorResponse: ErrorResponse = {
        error: "No Body in Post Req",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // upload image to S3
    const receiptLink = await imageUpload(
      requestData.get("file"),
      "reimbursment",
    );

    // create report name
    const clerkUserId = requestData.get("clerkUserId") as string;
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const organizationName = (
      clerkUser.unsafeMetadata.organization as Organization
    ).name;
    const reportName = `${organizationName} - ${new Date().toDateString()}`;

    const reimbursement: CreateReimbursementResponse = await new Reimbursement({
      clerkUserId,
      reportName,
      recipientName: requestData.get("recipientName") as string,
      recipientEmail: requestData.get("recipientEmail") as string,
      transactionDate: Date.parse(requestData.get("transactionDate") as string),
      amount: parseFloat(requestData.get("amount") as string),
      paymentMethod: requestData.get("paymentMethod") as string,
      purpose: requestData.get("purpose") as string,
      receiptLink: receiptLink,
      status: Status.Pending,
    }).save();
    return NextResponse.json(reimbursement);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Post Failed",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
