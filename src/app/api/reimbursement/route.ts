import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
// import { NextApiRequest, NextApiResponse } from "next";
import Reimbursement from "@/database/reimbursement-schema";

export type CreateReimbursementBody = Reimbursement;

export type GetReimbursementsResponse = Reimbursement[];
export type CreateReimbursementResponse = Reimbursement;

//Get all Reimbursements
export async function GET() {
  await connectDB();
  try {
    const reimbursements: GetReimbursementsResponse =
      await Reimbursement.find();
    return NextResponse.json(reimbursements);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Error fetching reimbursements",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

//Post Reimbursement
export async function POST(req: NextRequest) {
  await connectDB();
  const multer = require("multer");

  try {
    const reimburse: CreateReimbursementBody = await req.json();

    //validate input
    if (!reimburse) {
      const errorResponse: ErrorResponse = {
        error: "No Body in Post Req",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const reimbursement: CreateReimbursementResponse = await new Reimbursement(
      reimburse,
    ).save();
    return NextResponse.json(reimbursement);
    // res.status(201).json(reimbursement);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Post Failed",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
