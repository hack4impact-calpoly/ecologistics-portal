import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      Luke Waltz
      <div>
        <Button asChild>
          <Link href="/">Link to Home</Link>
        </Button>
      </div>
    </div>
  );
}
