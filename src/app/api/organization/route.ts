import { ErrorResponse } from "@/lib/error";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const organizations = await clerkClient.users.getUserList();
    return NextResponse.json(organizations);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      message: `Error fetching organizations: ${error.message}`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
