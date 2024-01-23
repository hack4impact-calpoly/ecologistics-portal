import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="text-center">
      <h1 className="text-green-900 text-3xl font-bold">
        Welcome to Kyle Taschek&apos;s Page!
      </h1>
      <Button className="bg-green-900 hover:bg-green-700" asChild>
        <Link href="/">Home</Link>
      </Button>
    </main>
  );
}
