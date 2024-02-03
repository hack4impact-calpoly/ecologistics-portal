import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white">
      <div className="py-1">
        <div className="flex justify-start items-center px-5 h-16">
          <Link href="/">
            <Image
              src="/images/ecologistics-logo.svg"
              alt="Ecologistics Logo"
              width={216}
              height={36}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
