import { User } from "@clerk/nextjs/server";

export const verifyAdmin = (user?: User | null): boolean =>
  user?.publicMetadata.admin === true || user?.publicMetadata.admin === "true";
