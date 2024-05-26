import { DELETE } from "@/app/api/alert/[id]/route";
import { GET } from "@/app/api/alert/route";
import Alert from "@/database/alert-schema";
import connectDB from "@/database/db";
import { User, currentUser } from "@clerk/nextjs/server";
import { mocked } from "jest-mock";
import mongoose, { Query } from "mongoose";
import { NextRequest } from "next/server";
import { MOCK_ALERT } from "../mocks/alert-mocks";
import { MOCK_SPONSORED_ORG_USER_APPROVED } from "../mocks/user-mocks";
import { formatMockAlertResponse, formatMockAlertsResponse } from "../utils";

jest.mock("@/database/db");
const mockedConnectDB = mocked(connectDB);
mockedConnectDB.mockResolvedValue({} as unknown as typeof mongoose);

jest.mock("@/database/alert-schema");
const mockedAlert = mocked(Alert);
mockedAlert.find.mockResolvedValue([MOCK_ALERT]);
mockedAlert.findById.mockReturnValue({
  orFail: jest.fn().mockResolvedValue(MOCK_ALERT),
} as unknown as Query<any, any>);
mockedAlert.findByIdAndDelete.mockReturnValue({
  orFail: jest.fn().mockResolvedValue(MOCK_ALERT),
} as unknown as Query<any, any>);

jest.mock("@clerk/nextjs/server");
const mockedCurrentUser = mocked(currentUser);
mockedCurrentUser.mockResolvedValue(
  MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
);

describe("Alert API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/alert", () => {
    it("returns all alerts for the current user", async () => {
      const response = await GET();
      const data = await response.json();
      expect(data).toEqual(formatMockAlertsResponse([MOCK_ALERT]));
      expect(response.status).toBe(200);
      expect(mockedAlert.find).toHaveBeenCalledWith({
        userId: MOCK_SPONSORED_ORG_USER_APPROVED.id,
      });
    });

    it("return an error if db query fails", async () => {
      mockedAlert.find.mockRejectedValueOnce("test-error");

      const response = await GET();
      const data = await response.json();
      expect(data.error).toBe("test-error");
      expect(response.status).toBe(404);
    });

    it("returns an error if user is not authenticated", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);

      const response = await GET();
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toBe("Unauthorized");
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/alert/[id]", () => {
    it("deletes an alert by id", async () => {
      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(data).toEqual(formatMockAlertResponse(MOCK_ALERT));
      expect(response.status).toBe(200);
      expect(mockedAlert.findById).toHaveBeenCalledWith("test-id");
      expect(mockedAlert.findByIdAndDelete).toHaveBeenCalledWith("test-id");
    });

    it("returns an error if alert not found", async () => {
      mockedAlert.findById.mockReturnValueOnce({
        orFail: jest.fn().mockRejectedValueOnce("test-error"),
      } as unknown as Query<any, any>);

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(data.error).toBe("test-error");
      expect(data.message).toBe("Error deleting alert");
      expect(response.status).toBe(404);
    });

    it("returns an error if user is not authenticated", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toBe("Unauthorized");
      expect(response.status).toBe(401);
    });

    it("returns an error if user is not authorized", async () => {
      mockedCurrentUser.mockResolvedValueOnce({
        ...MOCK_SPONSORED_ORG_USER_APPROVED,
        id: "different-user-id",
      } as unknown as User);

      const response = await DELETE({} as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(data.error).toBeNull();
      expect(data.message).toBe("Unauthorized");
      expect(response.status).toBe(401);
    });
  });
});
