"use client";

import { useRouter } from "next/router";

export default function NotFoundCatchAll() {
  const router = useRouter();
  return router.push("/");
}
