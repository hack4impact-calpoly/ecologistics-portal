import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import Reimbursement from "@database/reimbursementSchema";

export async function GET(req: NextRequest, params: { id: string }) {
  await connectDB();

  try {
    const { id } = params; // Extract the id from params
    const reimburse = await Reimbursement.findById(id);

    if (!reimburse) {
      return NextResponse.json("Reimbursement Not Found", { status: 404 });
    }

    return NextResponse.json(reimburse);
  } catch (error) {
    return NextResponse.json("Issue with Get Req", { status: 400 });
  }
}

// export async function GET(req: NextRequest, params: string) {
//   await connectDB();
//   const id = params;

//   try {
//     const reimburse = await Reimbursement.findById(id);
//     if (!reimburse) {
//       return NextResponse.json("Reimbursement Not Found", { status: 404 });
//       //   return NextResponse.error({ message: "Reimbursement not found" }, 404);
//     }
//     return NextResponse.json(reimburse);
//   } catch (error) {
//     return NextResponse.json("Issue with Get Req", { status: 400 });
//     // return NextResponse.error({ message: error.message }, 500);
//   }
// }
