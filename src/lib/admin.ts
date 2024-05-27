import { User } from "@clerk/nextjs/server";

export const verifyAdmin = (user?: Partial<User> | null): boolean =>
  user?.publicMetadata?.admin === true || user?.publicMetadata?.admin === "true";
