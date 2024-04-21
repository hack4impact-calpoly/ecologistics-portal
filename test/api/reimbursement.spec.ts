import { GET, POST } from "@/app/api/reimbursement/route";
import Reimbursement from "@/database/reimbursement-schema";
import connectDB from "@/database/db";
import { mocked } from "jest-mock";
import { NextRequest } from "next/server";
import { MOCK_REIMBURSEMENTS } from "../mocks/reimbursement-mocks";
import mongoose from "mongoose";
import { PUT, DELETE } from "@/app/api/reimbursement/[id]/route";

import {
  createMockNextRequest,
  formatMockReimbursementResponse,
  formatMockReimbursementsResponse,
  createNextRequestWithParams,
} from "../test-utils";

jest.mock("@/database/db");
const mockedConnectDB = mocked(connectDB);
mockedConnectDB.mockResolvedValue({} as unknown as typeof mongoose);

jest.mock("@/database/reimbursement-schema");
const mockedReimbursement = mocked(Reimbursement);
mockedReimbursement.find.mockResolvedValue(MOCK_REIMBURSEMENTS);
mockedReimbursement.prototype.save.mockResolvedValue(MOCK_REIMBURSEMENTS[0]);

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

  describe("POST /api/reimbursement", () => {
    it("creates a new reimbursement", async () => {
      const { req } = createMockNextRequest(MOCK_REIMBURSEMENTS[0]);

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
    });

    it("returns an error if no body is provided", async () => {
      const { req } = createMockNextRequest(null);

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data).toEqual({
        error: "No Body in Post Req",
      });
      expect(response.status).toBe(400);
    });

    it("returns an error if the post fails", async () => {
      mockedReimbursement.prototype.save.mockRejectedValueOnce(
        new Error("Failed to save"),
      );
      const { req } = createMockNextRequest(MOCK_REIMBURSEMENTS[0]);

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data).toEqual({
        error: "Post Failed",
      });
      expect(response.status).toBe(400);
    });
  });
});

describe("PUT /api/reimbursement/:id", () => {
  it("updates an existing reimbursement", async () => {
    const updateData = { recipientName: "Updated Name" };
    const { req, res } = createNextRequestWithParams(
      updateData,
      MOCK_REIMBURSEMENTS[0]._id.toString(),
      "PUT",
    );

    mockedReimbursement.findById.mockResolvedValue(MOCK_REIMBURSEMENTS[0]); // Ensure the findById is mocked
    mockedReimbursement.findByIdAndUpdate.mockResolvedValue({
      ...MOCK_REIMBURSEMENTS[0],
      ...updateData,
    });

    const response = await PUT(req, { params: req.params });
    const data = await response.json();
    expect(data.recipientName).toEqual("Updated Name");
    expect(response.status).toBe(200);
  });

  it("returns an error if reimbursement not found", async () => {
    const updateData = { recipientName: "Updated Name" };
    const { req, res } = createNextRequestWithParams(
      updateData,
      "nonexistentid",
      "PUT",
    );

    mockedReimbursement.findByIdAndUpdate.mockResolvedValue(null); // Simulate not finding the reimbursement

    const response = await PUT(req, { params: req.params });
    const data = await response.json();
    expect(data.error).toEqual("Unable to update reimbursement");
    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/reimbursement/:id", () => {
  it("deletes a reimbursement successfully", async () => {
    const { req, res } = createNextRequestWithParams(
      {},
      MOCK_REIMBURSEMENTS[0]._id.toString(),
      "DELETE",
    );

    mockedReimbursement.findByIdAndDelete.mockResolvedValue(
      MOCK_REIMBURSEMENTS[0],
    );

    const response = await DELETE(req, { params: req.params });
    const data = await response.json();
    expect(data.message).toEqual("Reimbursement successfully deleted");
    expect(response.status).toBe(200);
  });

  it("returns an error if unable to delete", async () => {
    const { req, res } = createNextRequestWithParams(
      {},
      "nonexistentid",
      "DELETE",
    );

    mockedReimbursement.findByIdAndDelete.mockRejectedValue(
      new Error("Delete failed"),
    );

    const response = await DELETE(req, { params: req.params });
    const data = await response.json();
    expect(data.error).toEqual("Unable to delete reimbursement");
    expect(response.status).toBe(500);
  });
});
