import { verifyAdmin } from "@/lib/admin";
import { ErrorResponse } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { User, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type GetUsersResponse = User[];

export async function GET(): Promise<
  NextResponse<GetUsersResponse | ErrorResponse>
> {
  // Verify that the request user is an admin
  const user = await currentUser();
  if (!verifyAdmin(user)) {
    return createErrorResponse(null, "Unauthorized", 401);
  }
  try {
    const users = await clerkClient.users.getUserList();
    return createSuccessResponse(users, 200);
  } catch (error) {
    return createErrorResponse(error, "Error fetching users", 404);
  }
}
