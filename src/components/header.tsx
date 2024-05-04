import Link from "next/link";
import Image from "next/image";
import Alert from "./alert-dropdown";

export default function Header() {
  return (
    <nav className="bg-[#EDEBDA]">
      <div className="py-1.5">
        <div className="flex justify-between items-center px-7 h-16">
          <Link href="/">
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
