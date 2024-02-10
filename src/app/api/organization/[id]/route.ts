import { NextRequest, NextResponse } from "next/server";
import Organization from "@/database/organizationSchema";
import connectDB from "@/database/db";
import mongoose from "mongoose";

type UpdateOrganizationBody = {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  reimbursements?: mongoose.Types.ObjectId[];
  status?: string;
};

type IParams = {
  params: {
    id: string;
  };
};

export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;
  const body: UpdateOrganizationBody = await req.json();
  const { ...updateFields } = body;

  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
        runValidators: true,
        omitUndefined: true,
      },
    );
    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        error: `No organization found with the provided ID (${id}) or unable to update`,
      },
      { status: 404 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;

  const deletedOrganization = await Organization.findByIdAndDelete(id);

  if (!deletedOrganization) {
    return NextResponse.json(
      { message: `No organization found with the provided ID ${id}.` },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: `Organization with ID ${id} was successfully deleted.` },
    { status: 200 },
  );
}
