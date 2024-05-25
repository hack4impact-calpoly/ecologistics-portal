import { User, currentUser, clerkClient } from "@clerk/nextjs/server";
import { mocked } from "jest-mock";
import {
  MOCK_ADMIN_USER,
  MOCK_SPONSORED_ORG_USER_APPROVED,
  MOCK_SPONSORED_ORG_USER_UNAPPROVED,
} from "../mocks/user-mocks";
import { GET } from "@/app/api/user/route";
import { PUT, UpdateUserBody } from "@/app/api/user/[id]/route";
import { NextRequest } from "next/server";
import { createMockNextRequest } from "../utils";

jest.mock("@clerk/nextjs/server");
const mockedClerkClient = mocked(clerkClient);
mockedClerkClient.users.getUserList.mockResolvedValue([
  MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
  MOCK_SPONSORED_ORG_USER_UNAPPROVED as unknown as User,
]);
mockedClerkClient.users.updateUserMetadata.mockResolvedValue(
  MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
);
const mockedCurrentUser = mocked(currentUser);
mockedCurrentUser.mockResolvedValue(MOCK_ADMIN_USER as unknown as User);

describe("User API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/user", () => {
    it("returns all users for admin user", async () => {
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual([
        MOCK_SPONSORED_ORG_USER_APPROVED,
        MOCK_SPONSORED_ORG_USER_UNAPPROVED,
      ]);
    });

    it("returns an error if clerk client fails", async () => {
      mockedClerkClient.users.getUserList.mockRejectedValueOnce("test-error");

      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(404);
      expect(data.error).toBe("test-error");
    });

    it("returns error if user is not admin", async () => {
      mockedCurrentUser.mockResolvedValueOnce(
        MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
      );

      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBe(null);
      expect(data.message).toBe("Unauthorized");
    });

    it("returns error if user is not authenticated", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);

      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBe(null);
      expect(data.message).toBe("Unauthorized");
    });
  });

  describe("PUT /api/user/[id]", () => {
    it("updates user metadata", async () => {
      const updateBody: UpdateUserBody = {
        unsafeMetadata: {
          organization: {
            approved: true,
          },
        },
      };
      const { req } = createMockNextRequest(updateBody);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual(MOCK_SPONSORED_ORG_USER_APPROVED);
      expect(mockedClerkClient.users.updateUserMetadata).toHaveBeenCalledWith(
        "test-id",
        updateBody,
      );
    });

    it("returns error if clerk client fails", async () => {
      mockedClerkClient.users.updateUserMetadata.mockRejectedValueOnce(
        "test-error",
      );
      const updateBody: UpdateUserBody = {
        unsafeMetadata: {
          organization: {
            approved: true,
          },
        },
      };
      const { req } = createMockNextRequest(updateBody);

      const response = await PUT(req as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(response.status).toBe(500);
      expect(data.error).toBe("test-error");
    });

    it("returns error if user is not admin", async () => {
      mockedCurrentUser.mockResolvedValueOnce(
        MOCK_SPONSORED_ORG_USER_APPROVED as unknown as User,
      );

      const response = await PUT({} as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBe(null);
      expect(data.message).toBe("Unauthorized");
    });

    it("returns error if user is not authenticated", async () => {
      mockedCurrentUser.mockResolvedValueOnce(null);

      const response = await PUT({} as unknown as NextRequest, {
        params: { id: "test-id" },
      });
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBe(null);
      expect(data.message).toBe("Unauthorized");
    });
  });
});
