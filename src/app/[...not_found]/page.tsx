"use client";

import { useRouter } from "next/navigation";

export default function NotFoundCatchAll() {
  const router = useRouter();
  return router.push("/");
}
