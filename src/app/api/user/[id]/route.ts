import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { ErrorResponse } from "@/lib/error";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = params;
  const body = await req.json();
  try {
    const response = await clerkClient.users.updateUserMetadata(id, {
      unsafeMetadata: body,
    });
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const errorResponse: ErrorResponse = {
      message: `Could not update user ${id}`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
