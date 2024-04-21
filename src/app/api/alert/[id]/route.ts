import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
// import { NextApiRequest, NextApiResponse } from "next";
import Alert from "@/database/alert-schema";

export type CreateAlertBody = Alert;
export type GetAlertResponse = Alert[]; // There might me multiple responses
export type CreateAlertResponse = Alert;

export type IParams = {
  params: {
    id: string;
  };
};

//Get all Reimbursements
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;
  try {
    const alerts: GetAlertResponse = await Alert.find({ name: id });
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
    const alerted: CreateAlertResponse = await new Alert(alert).save();
    return NextResponse.json(alert);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Post Failed",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const id = req.nextUrl.searchParams.get("id");
  try {
    await Alert.findByIdAndDelete(id); // not the clerk id but the actual id of the document
    return NextResponse.json("Succesfully Deleted Alert", { status: 200 });
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Error Deleteing Alert",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
