import { ErrorResponse } from "@/lib/error";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const allOrganizations = [];
    let organization;
    while (
      (organization = await clerkClient.users.getUserList({
        limit: 500,
        offset: allOrganizations.length,
      })).length > 0
    ) {
      allOrganizations.push(...organization);
    }
    return NextResponse.json(allOrganizations);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      error: `Error fetching organizations: ${error.message}`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
