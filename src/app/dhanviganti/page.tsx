import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Me() {
  return (
    <main>
      <div className="text-center">
        <h1 className="text-black-50 font-bold text-base">
          Welcome to my page!
        </h1>
      </div>
      <div className="text-center">
        <p>
          My name is Dhanvi Ganti, and I am a software developer at CalPoly SLO!
        </p>
        <Link href="../">
          <Button>Go home</Button>
        </Link>
      </div>
    </main>
  );
}
