import { User } from "@clerk/nextjs/server";

export const MOCK_SPONSORED_ORG_USER_UNAPPROVED = {
  id: "test",
  publicMetadata: {},
  unsafeMetadata: { organization: { name: "Test Org" } },
} as unknown as User;

export const MOCK_SPONSORED_ORG_USER_APPROVED = {
  id: "test",
  publicMetadata: {},
  unsafeMetadata: { organization: { name: "Test Org", approved: true } },
};

export const MOCK_ADMIN_USER = {
  id: "test",
  publicMetadata: { admin: true },
} as unknown as User;
