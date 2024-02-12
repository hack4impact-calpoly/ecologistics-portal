import connectDB from "@/database/db";
import { NextResponse, NextRequest } from "next/server";
import Reimbursement from "@/database/reimbursementSchema";

/**
 * Example GET API route
 * @returns {message: string}
 */

type IParams = {
  params: {
    id: string;
  };
};

export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const reimbursementId = { id: params.id };
  try {
    const body = await req.json();

    const currentReimbursement = await Reimbursement.findById(reimbursementId);

    if (!currentReimbursement) {
      return NextResponse.json(
        { error: "Reimbursement not found" },
        { status: 404 },
      );
    }

    const reimbursement = await Reimbursement.findByIdAndUpdate(
      reimbursementId,
      {
        $push: {
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
    );
    //does status show up in http
    return NextResponse.json({ status: 200 }, reimbursement);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE({ params }: IParams) {
  await connectDB();
  const reimbursementId = { id: params.id };
  try {
    await Reimbursement.findByIdAndDelete(reimbursementId);

    return NextResponse.json(
      { message: "Reimbursement successfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting reimbursement" },
      { status: 500 },
    );
  }
}
