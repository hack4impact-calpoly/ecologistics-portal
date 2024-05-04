import Link from "next/link";
import Image from "next/image";
import Alert from "./alert-dropdown";

export default function Header() {
  return (
    <nav>
      <div className="py-1">
        <div className="flex justify-between items-center px-5 h-16">
          {/* Priotize header link */}
          <Link href="/" className="z-10">
            <Image
              src="/images/ecologistics-logo.svg"
              alt="Ecologistics Logo"
              width={216}
              height={36}
            />
          </Link>
          <Alert />
        </div>
      </div>
    </nav>
  );
}
