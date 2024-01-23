import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/johnieng">
        <Button className="my-2 bg-sky-300 text-black-200">John Ieng</Button>
      </Link>
    </main>
  );
}
