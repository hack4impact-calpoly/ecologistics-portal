import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json("Reimbursement Not Found", { status: 404 });
  }
}
