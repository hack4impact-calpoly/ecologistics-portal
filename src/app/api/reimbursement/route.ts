import connectDB from "@/database/db";
import { Organization } from "@/models/organization";
import Reimbursement from "@/models/reimbursement";
import { verifyAdmin } from "@/lib/admin";
import Status from "@/lib/enum";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { imageUpload } from "@/services/s3-service";
import { User, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type GetReimbursementsResponse = Reimbursement[];
export type CreateReimbursementBody = Reimbursement;
export type CreateReimbursementResponse = Reimbursement;

// Get all Reimbursements
export async function GET(): Promise<
  NextResponse<GetReimbursementsResponse | ErrorResponse>
> {
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  await connectDB();
  try {
    // return all reimbursements if user is admin
    if (verifyAdmin(user)) {
      const reimbursements: GetReimbursementsResponse =
        await Reimbursement.find();
      return createSuccessResponse(reimbursements, 200);
    }
    // return only the reimbursements of the logged in user
    const reimbursements: GetReimbursementsResponse = await Reimbursement.find({
      clerkUserId: user.id,
    });
    return createSuccessResponse(reimbursements, 200);
  } catch (error) {
    return createErrorResponse(error, "Error fetching reimbursements", 404);
  }
}

const createReportName = (user: User): string => {
  const organizationName = (user.unsafeMetadata.organization as Organization)
    ?.name;
  return `${organizationName || "Unknown Organization"} - ${new Date().toDateString()}`;
};

// Create a Reimbursement
export async function POST(
  req: NextRequest,
): Promise<NextResponse<CreateReimbursementResponse | ErrorResponse>> {
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  await connectDB();
  try {
    // get multipart form data
    const formData = await req.formData();

    // upload image to S3
    const image = formData.get("file");
    if (!image) {
      return createErrorResponse(null, "No image provided", 400);
    }
    const receiptLink = await imageUpload(image as Blob, "reimbursment");

    // create report name
    const reportName = createReportName(user);

    // create reimbursement
    const reimbursement: CreateReimbursementResponse = await new Reimbursement({
      clerkUserId: user.id,
      reportName,
      recipientName: String(formData.get("recipientName")),
      recipientEmail: String(formData.get("recipientEmail")),
      transactionDate: Date.parse(String(formData.get("transactionDate"))),
      amount: parseFloat(String(formData.get("amount"))),
      paymentMethod: String(formData.get("paymentMethod")),
      purpose: String(formData.get("purpose")),
      receiptLink: receiptLink,
      status: Status.Pending,
    }).save();
    return createSuccessResponse(reimbursement, 200);
  } catch (error) {
    return createErrorResponse(error, "Error creating reimbursement", 500);
  }
}
