import connectDB from "@/database/db";
import { NextResponse, NextRequest } from "next/server";

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
  try {
    await connectDB();
    const reimbursementId = { id: params.id };
    const body = await req.json();

    const currentReimbursement = await Reimbursement.findById(reimbursementId);

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
          recipientLink:
            body.recipientLink || currentReimbursement.recipientLink,
          status: body.status || currentReimbursement.status,
        },
      },
    );

    return NextResponse.json(
      {
        message: `Successfully Updated Reimbursement with ID: ${reimbursementId}`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  try {
    await connectDB();
    const reimbursementId = { id: params.id };
    await Reimbursement.findByIdAndDelete(reimbursementId);

    return NextResponse.json(
      {
        message: `Successfully Deleted Reimbursement with ID: ${reimbursementId}`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
