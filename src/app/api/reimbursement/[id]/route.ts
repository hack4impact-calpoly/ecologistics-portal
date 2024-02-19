import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
import Reimbursement from "@/database/reimbursement-schema";

export type UpdateReimbursementBody = {
  organization?: string;
  reportName?: string;
  recipientName?: string;
  recipientEmail?: string;
  transactionDate?: Date;
  amount?: number;
  paymentMethod?: string;
  purpose?: string;
  receiptLink?: string;
  status?: string;
  comment?: string;
};

export type GetReimbursementResponse = Reimbursement;
export type UpdateReimbursementResponse = Reimbursement | null;
export type DeleteReimbursementResponse = {
  message: string;
};

export type IParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params; // Extract the id from params

  try {
    const reimburse: GetReimbursementResponse =
      await Reimbursement.findById(id).orFail();
    return NextResponse.json(reimburse);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Reimbursement Not Found",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;

  try {
    const body: UpdateReimbursementBody = await req.json();
    const currentReimbursement = await Reimbursement.findById(id);
    const reimbursement: UpdateReimbursementResponse =
      await Reimbursement.findByIdAndUpdate(
        id,
        {
          $set: {
            organization:
              body.organization || currentReimbursement.organization,
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
      );

    return NextResponse.json(reimbursement, { status: 200 });
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Unable to update reimbursement",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;
  try {
    await Reimbursement.findByIdAndDelete(id);
    const response: DeleteReimbursementResponse = {
      message: "Reimbursement successfully deleted",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Unable to delete reimbursement",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
