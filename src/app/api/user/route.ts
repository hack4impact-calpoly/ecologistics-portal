import { ErrorResponse } from "@/lib/error";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await clerkClient.users.getUserList({ limit: 500 });
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "Error fetching reimbursements",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
