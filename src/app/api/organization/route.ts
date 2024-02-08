import { NextRequest } from "next/server";
import { NextApiResponse } from "next";
import connectDB from "../../../database/db";
import Organization from "../../../database/organizationSchema";
// using "@/" for the paths don't seem to work. I couldn't fix the tsconfig to make it work either.

export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts before
  try {
    const organizations = await Organization.find();
    return organizations;
  } catch (error: any) {
    throw new Error(`Error fetching organizations: ${error.message}`);
  }
}

export async function POST(req: NextRequest, res: NextApiResponse) {
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
    return res.status(400).json({ error: "Missing required fields" });
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
  res.status(201).json({ status: "success", data: savedOrganization });
}
