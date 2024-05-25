import { DELETE, GET as GET_ID, PUT } from "@/app/api/reimbursement/[id]/route";
import { GET as GET_ALL, POST } from "@/app/api/reimbursement/route";
import Alert from "@/database/alert-schema";
import connectDB from "@/database/db";
import Reimbursement from "@/database/reimbursement-schema";
import Status from "@/lib/enum";
import { imageUpload } from "@/services/image-upload";
import { User, clerkClient, currentUser } from "@clerk/nextjs/server";
import { mocked } from "jest-mock";
import mongoose, { Query } from "mongoose";
import { NextRequest } from "next/server";
import { MOCK_ALERT } from "../mocks/alert-mocks";
import { MOCK_REIMBURSEMENTS } from "../mocks/reimbursement-mocks";
import {
  MOCK_ADMIN_USER,
  MOCK_SPONSORED_ORG_USER_APPROVED,
} from "../mocks/user-mocks";
import {
  createMockFormDataRequest,
  createMockNextRequest,
  formatMockReimbursementResponse,
  formatMockReimbursementsResponse,
} from "../utils";

jest.mock("@aws-sdk/client-s3");

jest.mock("@/database/db");
const mockedConnectDB = mocked(connectDB);
mockedConnectDB.mockResolvedValue({} as unknown as typeof mongoose);

jest.mock("@/database/reimbursement-schema");
const mockedReimbursement = mocked(Reimbursement);
mockedReimbursement.find.mockResolvedValue(MOCK_REIMBURSEMENTS);
mockedReimbursement.findById.mockReturnValue({
  orFail: jest.fn().mockResolvedValue(MOCK_REIMBURSEMENTS[0]),
} as unknown as Query<any, any>);
mockedReimbursement.findByIdAndUpdate.mockReturnValue({
  orFail: jest.fn().mockResolvedValue(MOCK_REIMBURSEMENTS[0]),
} as unknown as Query<any, any>);
mockedReimbursement.findByIdAndDelete.mockReturnValue({
  orFail: jest.fn().mockResolvedValue(MOCK_REIMBURSEMENTS[0]),
} as unknown as Query<any, any>);
mockedReimbursement.prototype.save.mockResolvedValue(MOCK_REIMBURSEMENTS[0]);

jest.mock("@/database/alert-schema");
const mockedAlert = mocked(Alert);
mockedAlert.prototype.save.mockResolvedValue(MOCK_ALERT);

jest.mock("@/services/image-upload");
const mockedImageUpload = mocked(imageUpload);
mockedImageUpload.mockResolvedValue(MOCK_REIMBURSEMENTS[0].receiptLink);

jest.mock("@clerk/nextjs/server");
const mockedClerkClient = mocked(clerkClient);
mockedClerkClient.users.getUser.mockResolvedValue(
  MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
);
const mockedCurrentUser = mocked(currentUser);
mockedCurrentUser.mockResolvedValue(
  MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
);

describe("Reimbursement API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reimbursement", () => {
    it("returns a list of reimbursements for regular user", async () => {
      const response = await GET_ALL();
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementsResponse(MOCK_REIMBURSEMENTS),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.find).toBeCalledWith({
        clerkUserId: "test",
      });
    });

    it("return a list of all reimbursements for admin user", async () => {
      mockedCurrentUser.mockResolvedValueOnce(
        MOCK_ADMIN_USER as unknown as User,
      );

      const response = await GET_ALL();
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementsResponse(MOCK_REIMBURSEMENTS),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.find).toBeCalled();
    });

    it("returns an error if the db find fails", async () => {
      mockedReimbursement.find.mockRejectedValueOnce("test-error");

      const response = await GET_ALL();
      const data = await response.json();
      expect(data.error).toEqual("test-error");
      expect(response.status).toBe(404);
    });

    it("returns an error if user is not found", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);

      const response = await GET_ALL();
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/reimbursement/:id", () => {
    it("returns a single reimbursement", async () => {
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();

      const response = await GET_ID({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.findById).toBeCalledWith(reimbursementId);
    });

    it("returns a single reimbursement for admin user", async () => {
      mockedCurrentUser.mockResolvedValueOnce(
        MOCK_ADMIN_USER as unknown as User,
      );
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();

      const response = await GET_ID({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.findById).toBeCalledWith(reimbursementId);
    });

    it("returns an error if reimbursement not found", async () => {
      mockedReimbursement.findById.mockReturnValueOnce({
        orFail: jest.fn().mockRejectedValue("test-error"),
      } as unknown as Query<any, any>);

      const response = await GET_ID({} as unknown as NextRequest, {
        params: { id: "nonexistentid" },
      });
      const data = await response.json();
      expect(data.error).toEqual("test-error");
      expect(response.status).toBe(404);
    });

    it("returns an error if user does not have permission", async () => {
      mockedReimbursement.findById.mockReturnValueOnce({
        orFail: jest.fn().mockResolvedValue(MOCK_REIMBURSEMENTS[1]),
      } as unknown as Query<any, any>);
      const reimbursementId = MOCK_REIMBURSEMENTS[1]._id.toString();

      const response = await GET_ID({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });

    it("returns an error if user is not found", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();

      const response = await GET_ID({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/reimbursement", () => {
    it("creates a new reimbursement", async () => {
      const reqData = formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]);
      const { req } = createMockFormDataRequest({
        ...reqData,
        file: "test-file",
      });

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data).toEqual(reqData);
      expect(response.status).toBe(200);
      expect(mockedImageUpload).toBeCalledWith("test-file", "reimbursment");
      expect(mockedCurrentUser).toBeCalled();
      expect(mockedReimbursement.prototype.save).toBeCalled();
    });

    it("returns an error if no image is provided", async () => {
      const reqData = formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]);
      const { req } = createMockFormDataRequest(reqData);

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("No image provided");
      expect(response.status).toBe(400);
    });

    it("returns an error if db save fails", async () => {
      mockedReimbursement.prototype.save.mockRejectedValueOnce("test-error");
      const reqData = formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]);
      const { req } = createMockFormDataRequest({
        ...reqData,
        file: "test-file",
      });

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data.error).toEqual("test-error");
      expect(response.status).toBe(500);
    });

    it("returns an error if user is not found", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);
      const reqData = formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]);
      const { req } = createMockFormDataRequest({
        ...reqData,
        file: "test-file",
      });

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/reimbursement/:id", () => {
    it("updates an existing reimbursement", async () => {
      const updateData = { recipientName: "Updated Name" };
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();
      const { req } = createMockNextRequest(updateData);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.findByIdAndUpdate).toBeCalledWith(
        reimbursementId,
        {
          $set: { ...MOCK_REIMBURSEMENTS[0], ...updateData, _id: undefined },
        },
        { new: true },
      );
    });

    it("updates the status and creates an alert", async () => {
      const updateData = { status: Status.Paid };
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();
      const { req } = createMockNextRequest(updateData);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.findByIdAndUpdate).toBeCalledWith(
        reimbursementId,
        {
          $set: { ...MOCK_REIMBURSEMENTS[0], ...updateData, _id: undefined },
        },
        { new: true },
      );
      expect(mockedAlert.prototype.save).toBeCalled();
    });

    it("returns an error if status is invalid", async () => {
      const updateData = { status: "Invalid Status" };
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();
      const { req } = createMockNextRequest(updateData);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Invalid status");
      expect(response.status).toBe(400);
    });

    it("returns an error if db update fails", async () => {
      const updateData = { recipientName: "Updated Name" };
      const { req } = createMockNextRequest(updateData);

      mockedReimbursement.findByIdAndUpdate.mockReturnValueOnce({
        orFail: jest.fn().mockRejectedValue("test-error"),
      } as unknown as Query<any, any>);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: "nonexistentid" },
      });
      const data = await response.json();
      expect(data.error).toEqual("test-error");
      expect(response.status).toBe(500);
    });

    it("return an error if user does not have permission", async () => {
      mockedReimbursement.findById.mockReturnValueOnce({
        orFail: jest.fn().mockResolvedValue(MOCK_REIMBURSEMENTS[1]),
      } as unknown as Query<any, any>);
      const updateData = { recipientName: "Updated Name" };
      const reimbursementId = MOCK_REIMBURSEMENTS[1]._id.toString();
      const { req } = createMockNextRequest(updateData);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });

    it("returns an error if user is not found", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);
      const updateData = { recipientName: "Updated Name" };
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();
      const { req } = createMockNextRequest(updateData);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/reimbursement/:id", () => {
    it("deletes a reimbursement successfully", async () => {
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.findByIdAndDelete).toBeCalledWith(
        reimbursementId,
      );
    });

    it("deletes a reimbursement for admin user", async () => {
      mockedCurrentUser.mockResolvedValueOnce(
        MOCK_ADMIN_USER as unknown as User,
      );
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data).toEqual(
        formatMockReimbursementResponse(MOCK_REIMBURSEMENTS[0]),
      );
      expect(response.status).toBe(200);
      expect(mockedReimbursement.findByIdAndDelete).toBeCalledWith(
        reimbursementId,
      );
    });

    it("returns an error if unable to delete", async () => {
      mockedReimbursement.findByIdAndDelete.mockReturnValueOnce({
        orFail: jest.fn().mockRejectedValue("test-error"),
      } as unknown as Query<any, any>);

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: "nonexistentid" },
      });
      const data = await response.json();
      expect(data.error).toEqual("test-error");
      expect(response.status).toBe(404);
    });

    it("returns an error if user does not have permission", async () => {
      mockedReimbursement.findById.mockReturnValueOnce({
        orFail: jest.fn().mockResolvedValue(MOCK_REIMBURSEMENTS[1]),
      } as unknown as Query<any, any>);
      const reimbursementId = MOCK_REIMBURSEMENTS[1]._id.toString();

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });

    it("returns an error if user is not found", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);
      const reimbursementId = MOCK_REIMBURSEMENTS[0]._id.toString();

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: reimbursementId },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toEqual("Unauthorized");
      expect(response.status).toBe(401);
    });
  });
});
