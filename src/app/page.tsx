import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <div>
        <Button asChild>
          <Link href="/namepage">Link to Luke</Link>
        </Button>
      </div>
    </main>
  );
}
