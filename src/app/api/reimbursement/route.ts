import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
// import { NextApiRequest, NextApiResponse } from "next";
import Reimbursement from "@/database/reimbursementSchema";

interface ReimbursementBody extends Reimbursement {}

//Get all Reimbursements
export async function GET() {
  await connectDB();
  try {
    const reimbursements: ReimbursementBody[] = await Reimbursement.find();
    return NextResponse.json(reimbursements);
  } catch (error) {
    return NextResponse.error();
    // return NextResponse.error({ message: error.message }, 500);
  }
}

//Post Reimbursement
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const reimburse = await req.json();
    console.log(reimburse);

    //validate input
    if (!reimburse) {
      const errorResponse: ErrorResponse = {
        error: "No Body in Post Req",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const reimbursement = new Reimbursement(reimburse);
    await reimbursement.save();
    return NextResponse.json(reimbursement);
    // res.status(201).json(reimbursement);
  } catch (error) {
    console.log(error);
    const errorResponse: ErrorResponse = {
      error: "Post Failed",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
