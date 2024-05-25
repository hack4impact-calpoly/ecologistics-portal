import Alert from "@/database/alert-schema";
import connectDB from "@/database/db";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";

export type DeleteAlertResponse = Alert;

export type IParams = {
  params: {
    id: string;
  };
};

// Delete an alert
export async function DELETE(
  req: NextRequest,
  { params }: IParams,
): Promise<NextResponse<DeleteAlertResponse | ErrorResponse>> {
  const { id } = params;
  await connectDB();
  try {
    const alert = await Alert.findByIdAndDelete(id);
    if (!alert) {
      return createErrorResponse(null, "Alert not found", 404);
    }
    return createSuccessResponse(alert, 200);
  } catch (error) {
    return createErrorResponse(error, "Error deleting alert", 404);
  }
}
