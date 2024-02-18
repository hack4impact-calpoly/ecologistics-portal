import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  //   publicRoutes: ["/"], This is left here as a reminder that we can add pages that don't require auth.
  publicRoutes: ["/register"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
