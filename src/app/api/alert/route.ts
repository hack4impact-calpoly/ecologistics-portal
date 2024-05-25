import Alert from "@/database/alert-schema";
import connectDB from "@/database/db";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type GetAlertResponse = Alert[];
export type CreateAlertBody = Alert;
export type CreateAlertResponse = Alert;

// Get all alerts by Clerk user ID
export async function GET(): Promise<
  NextResponse<GetAlertResponse | ErrorResponse>
> {
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  await connectDB();
  try {
    const alerts: GetAlertResponse = await Alert.find({ userId: user.id });
    return createSuccessResponse(alerts, 200);
  } catch (error) {
    return createErrorResponse(error, "Error fetching alerts", 404);
  }
}

// Create an alert
export async function POST(
  req: NextRequest,
): Promise<NextResponse<CreateAlertResponse | ErrorResponse>> {
  await connectDB();
  try {
    const body: CreateAlertBody = await req.json();
    const alert: CreateAlertResponse = await new Alert(body).save();
    return createSuccessResponse(alert, 201);
  } catch (error) {
    return createErrorResponse(error, "Error creating alert", 404);
  }
}
