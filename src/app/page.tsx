import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/brandon">
        <Button variant="outline">Go To Brandon&apos;s Page</Button>
      </Link>
    </main>
  );
}
