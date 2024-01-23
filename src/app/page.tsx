import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Button className="bg-green-900 hover:bg-green-700" asChild>
        <Link href="/ktaschek">Kyle Taschek</Link>
      </Button>
    </main>
  );
}
