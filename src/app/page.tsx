import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { choosingTheBadge } from "@/components/statusBadge";
import Status from "@/lib/enum";

export default function Home() {
  return choosingTheBadge(Status.NeedsReview);
}
