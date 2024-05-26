import { ErrorResponse } from "@/lib/error";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allUsers = [];
    let users;
    while (
      (users = await clerkClient.users.getUserList({
        limit: 500,
        offset: allUsers.length,
      })).length > 0
    ) {
      allUsers.push(...users);
    }
    return NextResponse.json(allUsers);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Error fetching reimbursements",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
