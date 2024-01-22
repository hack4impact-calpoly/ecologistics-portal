import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Button asChild>
        <Link href="/vi">go to page</Link>
      </Button>
    </main>
  );
}
