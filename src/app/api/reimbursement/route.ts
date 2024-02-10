import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";
import Reimbursement from "@database/reimbursementSchema";

//Get all Reimbursements
export async function GET() {
  await connectDB();
  try {
    const reimbursements = await Reimbursement.find();
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
      return NextResponse.json("No Body in Post Req", { status: 400 });
    }
    const reimbursement = new Reimbursement(reimburse);
    await reimbursement.save();
    return NextResponse.json(reimbursement);
    // res.status(201).json(reimbursement);
  } catch (error) {
    console.log(error);
    // res.status(400).json({ message: "Reimbursement Post Failed" });
    return NextResponse.json("Post Failed", { status: 400 });
  }
}
