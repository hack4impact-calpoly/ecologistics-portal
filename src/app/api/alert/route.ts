import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
// import { NextApiRequest, NextApiResponse } from "next";
import Alert from "@/database/alert-schema";

export type CreateAlertBody = Alert;
export type GetAlertResponse = Alert[]; // There might me multiple responses
export type CreateAlertResponse = Alert;

//Get all Reimbursements
export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const jsonResponse: string = JSON.stringify(req);
    const data: any = JSON.parse(jsonResponse);
    const userId: string = data.userId;
    const alerts: GetAlertResponse = await Alert.find({ name: userId });
    return NextResponse.json(alerts);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Error fetching alerts",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

//Post Reimbursement
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const alert: CreateAlertBody = await req.json();

    //validate input
    if (!alert) {
      const errorResponse: ErrorResponse = {
        error: "No Body in Post Req",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const reimbursement: CreateAlertResponse = await new Alert(alert).save();
    return NextResponse.json(alert);
    // res.status(201).json(reimbursement);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Post Failed",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

// export async function DELETE(req: NextRequest) {

// }

// export async function DELETE(request) {
//     const id = request.nextUrl.searchParams.get('id')
//     await connectMongoDB();
//     await Wisdom.findByIdAndDelete(id);
//     return NextResponse.json({message: "Wisdom Erased"}, {status: 200});
// }
