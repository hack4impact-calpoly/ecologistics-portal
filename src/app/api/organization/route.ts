import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import Organization from "@/database/organizationSchema";

export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts before
  try {
    const organizations = await Organization.find();
    return NextResponse.json(organizations);
  } catch (error: any) {
    throw new Error(`Error fetching organizations: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      return NextResponse.json(
        "Invalid fields provided, make sure every required field is non-null.",
        { status: 404 },
      );
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
    return NextResponse.json(
      "Please make sure every required field is in your request.",
      { status: 404 },
    );
  }
}
