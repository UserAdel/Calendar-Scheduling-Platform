import Link from "next/link";
import Image from "next/image";
import { AuthModal } from "./AuthModal";

export async function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between ">
      <Link className="flex items-center gap-2" href="/">
        <Image
          src="/LOGO.png"
          alt="LOGO"
          className="size-12"
          width={120}
          height={120}
        />
        <h4 className="text-3xl font-semibold">
          Cal<span className="text-blue-500">Marshal</span>
        </h4>
      </Link>

      <AuthModal />
    </div>
  );
}
