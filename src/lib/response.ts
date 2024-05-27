import { NextResponse } from "next/server";
import { ErrorResponse } from "./error";

export const createSuccessResponse = <T>(data: T, status: number): NextResponse<T> =>
  NextResponse.json(data, { status });

export const createErrorResponse = (error: any, message: string, status: number): NextResponse<ErrorResponse> =>
  NextResponse.json(
    {
      error,
      message,
    },
    { status },
  );
