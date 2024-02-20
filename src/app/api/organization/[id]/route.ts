import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/lib/error";
import Organization from "@/database/organization-schema";
import connectDB from "@/database/db";
import mongoose from "mongoose";

export type UpdateOrganizationBody = {
  name?: string;
  description?: string;
  website?: string;
  clerkUser?: string;
  logo?: string;
  reimbursements?: string[];
  status?: string;
};

export type GetOrganizationResponse = Organization;
export type UpdateOrganizationResponse = Organization | null;
export type DeleteOrganizationResponse = {
  message: string;
};

type IParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts before
  const { id } = params;

  try {
    const blog: GetOrganizationResponse = await Organization.findOne({
      clerkUser: id,
    }).orFail();

    return NextResponse.json(blog, { status: 200 });
  } catch (err) {
    const errorResponse: ErrorResponse = {
      error: `Organization not found.`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;
  const body: UpdateOrganizationBody = await req.json();
  if (body.hasOwnProperty("clerkUser")) {
    delete body["clerkUser"];
  }
  const { ...updateFields } = body;

  try {
    const updatedOrganization: UpdateOrganizationResponse =
      await Organization.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
        omitUndefined: true,
      });
    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (err) {
    const errorResponse: ErrorResponse = {
      error: `No organization found with the provided ID (${id}) or unable to update`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { id } = params;

  const deletedOrganization = await Organization.findByIdAndDelete(id);

  if (!deletedOrganization) {
    const errorResponse: ErrorResponse = {
      error: `No organization found with the provided ID ${id}.`,
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }

  const response: DeleteOrganizationResponse = {
    message: `Organization with ID ${id} was successfully deleted.`,
  };
  return NextResponse.json(response, { status: 200 });
}
