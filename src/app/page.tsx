import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/kimlinh">
        <Button variant="outline">Kim-Linh</Button>
      </Link>
    </main>
  );
}
