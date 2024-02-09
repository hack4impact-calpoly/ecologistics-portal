import connectDB from "@database/db";
import { NextResponse } from "next/server";
import Reimbursement from "@database/reimbursementSchema";

export async function GET({ params }: { params: any }) {
  await connectDB();
  const { id } = params;

  try {
    const reimbursement = await Reimbursement.findById(id);
    if (!reimbursement) {
      return NextResponse.error();
      //   return NextResponse.error({ message: "Reimbursement not found" }, 404);
    }
    return NextResponse.json(reimbursement);
  } catch (error) {
    return NextResponse.error();
    // return NextResponse.error({ message: error.message }, 500);
  }
}
