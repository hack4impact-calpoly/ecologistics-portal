import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
import connectDB from "@/database/db";
import Organization from "@/database/organizationSchema";

interface OrganizationBody extends Organization {}

export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts before
  try {
    const organizations: OrganizationBody[] = await Organization.find();
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
    const body: OrganizationBody = await req.json();

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

    const savedOrganization = await newOrganization.save();

    // Respond with the created organization
    return NextResponse.json(savedOrganization);
  } catch (err) {
    const errorResponse: ErrorResponse = {
      error: "Please make sure every required field is in your request.",
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}
