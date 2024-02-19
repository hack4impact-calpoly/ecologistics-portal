import { NextResponse, NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import connectDB from "@/database/db";
import Organization from "@/database/organizationSchema";

type IParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;
  try {
    const organization = await Organization.findOne({ clerkUser: id });
    console.log(organization);
    await clerkClient.users.updateUserMetadata(id, {
      unsafeMetadata: {
        organization: organization.name,
      },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
