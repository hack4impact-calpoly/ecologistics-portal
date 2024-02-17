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
    console.log(id);
    const reimburse = await Reimbursement.findById(id);
    return NextResponse.json(reimburse);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Reimbursement Not Found",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
