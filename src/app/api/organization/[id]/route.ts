import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/database/db";
import Organization from "@/database/organizationSchema";

type IParams = {
  params: {
    id: string;
  };
};
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts before
  const { id } = params;

  try {
    const blog = await Organization.findOne({ clerkUser: id }).orFail();

    return NextResponse.json(blog, { status: 200 });
  } catch (err) {
    return NextResponse.json("Organization not found.", { status: 404 });
  }
}
