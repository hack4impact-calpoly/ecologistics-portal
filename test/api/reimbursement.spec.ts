import { GET, POST } from "@/app/api/reimbursement/route";
import Reimbursement from "@/database/reimbursement-schema";
import connectDB from "@/database/db";
import { mocked } from "jest-mock";
import { NextRequest } from "next/server";
import { MOCK_REIMBURSEMENTS } from "../mocks/reimbursement-mocks";
import mongoose from "mongoose";
import {
  createMockNextRequest,
  formatMockReimbursementResponse,
  formatMockReimbursementsResponse,
} from "../test-utils";

jest.mock("@/database/db");
const mockedConnectDB = mocked(connectDB);
mockedConnectDB.mockResolvedValue({} as unknown as typeof mongoose);

jest.mock("@/database/reimbursement-schema");
const mockedReimbursement = mocked(Reimbursement);
mockedReimbursement.find.mockResolvedValue(MOCK_REIMBURSEMENTS);
mockedReimbursement.prototype.save.mockResolvedValue(MOCK_REIMBURSEMENTS[0]);

jest.mock("@/services/image-upload");
jest.mock("@aws-sdk/client-s3");

describe("Reimbursement API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reimbursement", () => {
    it("returns a list of reimbursements", async () => {
      const response = await GET();
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementsResponse(MOCK_REIMBURSEMENTS),
      );
      expect(response.status).toBe(200);
    });

    it("returns an error if the get fails", async () => {
      mockedReimbursement.find.mockRejectedValueOnce(
        new Error("Failed to fetch reimbursements"),
      );

      const response = await GET();
      const data = await response.json();
      expect(data).toEqual({
        error: "Error fetching reimbursements",
      });
      expect(response.status).toBe(404);
    });
  });

  // describe("POST /api/reimbursement", () => {
  //   it("creates a new reimbursement", async () => {
  //     const { req } = createMockNextRequest(MOCK_REIMBURSEMENTS[0]);

  //     const response = await POST(req as unknown as NextRequest);
  //     const data = await response.json();
  //     expect(data).toEqual(
  //       formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
  //     );
  //     expect(response.status).toBe(200);
  //   });

  //   it("returns an error if no body is provided", async () => {
  //     const { req } = createMockNextRequest(null);

  //     const response = await POST(req as unknown as NextRequest);
  //     const data = await response.json();
  //     expect(data).toEqual({
  //       error: "No Body in Post Req",
  //     });
  //     expect(response.status).toBe(400);
  //   });

  //   it("returns an error if the post fails", async () => {
  //     mockedReimbursement.prototype.save.mockRejectedValueOnce(
  //       new Error("Failed to save"),
  //     );
  //     const { req } = createMockNextRequest(MOCK_REIMBURSEMENTS[0]);

  //     const response = await POST(req as unknown as NextRequest);
  //     const data = await response.json();
  //     expect(data).toEqual({
  //       error: "Post Failed",
  //     });
  //     expect(response.status).toBe(400);
  //   });

  //   it("returns an error if the status is invalid", async () => {
  //     const invalidReimbursement = {
  //       ...MOCK_REIMBURSEMENTS[0],
  //       status: "invalid",
  //     };
  //     const { req } = createMockNextRequest(invalidReimbursement);

  //     const response = await POST(req as unknown as NextRequest);
  //     const data = await response.json();
  //     expect(data).toEqual({
  //       error: "Status is not valid or undefined",
  //     });
  //     expect(response.status).toBe(404);
  //   });
  // });
});
