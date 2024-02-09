import connectDB from "@database/db";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
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
export async function POST({ request }: { request: NextApiRequest }) {
  await connectDB();

  try {
    // const data = await request.json(); // Assuming request body contains the reimbursement data
    const data = JSON.parse(request.body);
    const reimbursement = new Reimbursement(data);
    await reimbursement.save();
    return NextResponse.json(reimbursement);
  } catch (error) {
    return NextResponse.error();
    // return NextResponse.error({ message: error.message }, 400);
  }
}
