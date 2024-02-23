import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white">
      <div className="py-1">
        <div className="flex justify-between items-center px-5 h-16">
          <Link href="/">
            <Image
              src="/images/ecologistics-logo.svg"
              alt="Ecologistics Logo"
              width={216}
              height={36}
            />
          </Link>
          <UserButton afterSignOutUrl="/"></UserButton>
        </div>
      </div>
    </nav>
  );
}
