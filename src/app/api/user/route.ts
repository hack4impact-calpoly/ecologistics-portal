import { ErrorResponse } from "@/lib/error";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await clerkClient.users.getUserList();
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: "Error fetching reimbursements",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
