import Alert from "@/database/alert-schema";
import connectDB from "@/database/db";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type GetAlertResponse = Alert[];

// Get all alerts by Clerk user ID
export async function GET(): Promise<NextResponse<GetAlertResponse | ErrorResponse>> {
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
