import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl="/"></UserButton>
      <h1>Home</h1>
      <Button variant="destructive" asChild>
        <Link href="/Taran">Taran</Link>
      </Button>
    </main>
  );
}
