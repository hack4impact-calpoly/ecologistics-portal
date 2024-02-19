import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
import Reimbursement from "@/database/reimbursementSchema";

export type IParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params; // Extract the id from params

  try {
    const reimburse = await Reimbursement.findById(id);
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
    const body = await req.json();
    const currentReimbursement = await Reimbursement.findById(id);

    if (!currentReimbursement) {
      return NextResponse.json(
        { error: "Reimbursement not found" },
        { status: 404 },
      );
    }

    const reimbursement = await Reimbursement.findByIdAndUpdate(
      id,
      {
        $set: {
          organization: body.organization || currentReimbursement.organization,
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
    console.log(reimbursement);

    return NextResponse.json({ message: reimbursement }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;
  try {
    await Reimbursement.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Reimbursement successfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
