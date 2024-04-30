import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
import connectDB from "@/database/db";
import Organization from "@/database/organization-schema";
import { clerkClient } from "@clerk/nextjs/server";

export type CreateOrganizationBody = Organization;

export type GetOrganizationsResponse = Organization[];
export type CreateOrganizationResponse = Organization;

export async function GET(req: NextRequest) {
  try {
    const organizations = await clerkClient.users.getUserList();
    return NextResponse.json(organizations);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      error: `Error fetching organizations: ${error.message}`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrganizationBody = await req.json();

    const {
      name,
      description,
      website,
      clerkUser,
      logo,
      reimbursements,
      status,
    } = body;

    // Validate the required fields
    if (!name || !description || !clerkUser || !status) {
      const errorResponse: ErrorResponse = {
        error:
          "Invalid fields provided, make sure every required field is non-null.",
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const newOrganization = new Organization({
      name,
      description,
      website,
      clerkUser,
      logo,
      reimbursements,
      status,
    });

    const savedOrganization: CreateOrganizationResponse =
      await newOrganization.save();

    // Respond with the created organization
    return NextResponse.json(savedOrganization);
  } catch (err) {
    const errorResponse: ErrorResponse = {
      error: "Please make sure every required field is in your request.",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
