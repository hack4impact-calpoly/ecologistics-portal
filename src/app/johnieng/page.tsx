import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Page() {
  return (
    <main className="text-center">
      <h1>Hello!</h1>
      <p>My name is John, welcome to my page!</p>
      <Link href="/">
        <Button className="bg-cyan-800 mt-5 hover:bg-sky-200 hover:text-black">
          Take me back!
        </Button>
      </Link>
    </main>
  );
}
