import Alert from "@/database/alert-schema";
import connectDB from "@/database/db";
import Reimbursement from "@/database/reimbursement-schema";
import { verifyAdmin } from "@/lib/admin";
import Status from "@/lib/enum";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type GetReimbursementResponse = Reimbursement;
export type UpdateReimbursementBody = Partial<Reimbursement>;
export type UpdateReimbursementResponse = Reimbursement;
export type DeleteReimbursementResponse = Reimbursement;

export type IParams = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: IParams,
): Promise<NextResponse<GetReimbursementResponse | ErrorResponse>> {
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  await connectDB();
  const { id } = params;
  try {
    const reimbursement: GetReimbursementResponse =
      await Reimbursement.findById(id).orFail();
    // verify that user is admin or creator of reimbursement
    if (!verifyAdmin(user) && reimbursement.clerkUserId !== user.id) {
      return createErrorResponse(null, "Unauthorized", 401);
    }
    return createSuccessResponse(reimbursement, 200);
  } catch (error) {
    return createErrorResponse(error, "Error fetching reimbursement", 404);
  }
}

const createAlert = (
  body: UpdateReimbursementBody,
  currentReimbursement: Reimbursement,
): Promise<Alert> =>
  new Alert({
    userId: body.clerkUserId,
    title: body.reportName,
    description: `Status: ${body.status || currentReimbursement.status}\nComment: ${body.comment || currentReimbursement.comment || "N/A"}`,
  }).save();

export async function PUT(
  req: NextRequest,
  { params }: IParams,
): Promise<NextResponse<UpdateReimbursementResponse | ErrorResponse>> {
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  await connectDB();
  const { id } = params;
  try {
    const body: UpdateReimbursementBody = await req.json();

    // verify status
    if (body.status && !Object.values(Status).includes(body.status as Status)) {
      return createErrorResponse(null, "Invalid status", 400);
    }

    // verify that user is admin or creator of reimbursement
    const currentReimbursement: Reimbursement =
      await Reimbursement.findById(id).orFail();
    if (!verifyAdmin(user) && currentReimbursement.clerkUserId !== user.id) {
      return createErrorResponse(null, "Unauthorized", 401);
    }

    // create alert if status or comment is updated
    if (
      (body.status && body.status !== currentReimbursement.status) ||
      (body.comment && body.comment !== currentReimbursement.comment)
    ) {
      await createAlert(body, currentReimbursement);
    }

    const reimbursement: UpdateReimbursementResponse =
      await Reimbursement.findByIdAndUpdate(
        id,
        {
          $set: {
            clerkUserId: body.clerkUserId || currentReimbursement.clerkUserId,
            reportName: body.reportName || currentReimbursement.reportName,
            recipientName:
              body.recipientName || currentReimbursement.recipientName,
            recipientEmail:
              body.recipientEmail || currentReimbursement.recipientEmail,
            transactionDate:
              body.transactionDate || currentReimbursement.transactionDate,
            amount: body.amount || currentReimbursement.amount,
            paymentMethod:
              body.paymentMethod || currentReimbursement.paymentMethod,
            purpose: body.purpose || currentReimbursement.purpose,
            receiptLink: body.receiptLink || currentReimbursement.receiptLink,
            status: body.status || currentReimbursement.status,
            comment: body.comment || currentReimbursement.comment,
          },
        },
        { new: true },
      ).orFail();
    return createSuccessResponse(reimbursement, 200);
  } catch (error) {
    return createErrorResponse(error, "Error updating reimbursement", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: IParams,
): Promise<NextResponse<DeleteReimbursementResponse | ErrorResponse>> {
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  await connectDB();
  const { id } = params;
  try {
    const reimbursement: DeleteReimbursementResponse =
      await Reimbursement.findById(id).orFail();
    // verify that user is admin or creator of reimbursement
    if (!verifyAdmin(user) && reimbursement.clerkUserId !== user.id) {
      return createErrorResponse(null, "Unauthorized", 401);
    }
    await Reimbursement.findByIdAndDelete(id).orFail();
    return createSuccessResponse(reimbursement, 200);
  } catch (error) {
    return createErrorResponse(error, "Error deleting reimbursement", 404);
  }
}
