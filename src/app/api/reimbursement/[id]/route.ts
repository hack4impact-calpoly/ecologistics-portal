import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import Reimbursement from "@database/reimbursementSchema";

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

    if (!reimburse) {
      return NextResponse.json("Reimbursement Not Found", { status: 404 });
    }
    return NextResponse.json(reimburse);
  } catch (error) {
    return NextResponse.json("Issue with Get Req", { status: 400 });
  }
}
