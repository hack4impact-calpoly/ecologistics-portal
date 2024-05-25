import { verifyAdmin } from "@/lib/admin";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { User, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type UpdateUserBody = {
  privateMetadata?: UserPrivateMetadata;
  publicMetadata?: UserPublicMetadata;
  unsafeMetadata?: UserUnsafeMetadata;
};
export type UpdateUserResponse = User;

export async function PUT(
  req: NextRequest,
  { params }: any,
): Promise<NextResponse<UpdateUserResponse | ErrorResponse>> {
  // Verify that the request user is an admin
  const user = await currentUser();
  if (!verifyAdmin(user)) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  const { id } = params;
  const body: UpdateUserBody = await req.json();
  try {
    const user = await clerkClient.users.updateUserMetadata(id, {
      privateMetadata: body.privateMetadata,
      publicMetadata: body.publicMetadata,
      unsafeMetadata: body.unsafeMetadata,
    });
    return createSuccessResponse(user, 200);
  } catch (err) {
    return createErrorResponse(err, "Error updating user", 500);
  }
}
