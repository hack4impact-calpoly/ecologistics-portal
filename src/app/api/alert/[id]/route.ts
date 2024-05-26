import Alert from "@/models/alert";
import connectDB from "@/database/db";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { verifyAdmin } from "@/lib/admin";

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
  const user = await currentUser();
  if (!user) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  const { id } = params;
  await connectDB();
  try {
    const alert = await Alert.findById(id).orFail();
    if (!verifyAdmin(user) && alert.userId !== user.id) {
      return createErrorResponse(null, "Unauthorized", 401);
    }
    await Alert.findByIdAndDelete(id).orFail();
    return createSuccessResponse(alert, 200);
  } catch (error) {
    return createErrorResponse(error, "Error deleting alert", 404);
  }
}
