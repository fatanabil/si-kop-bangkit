import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface NavlinkProps {
  href: string;
  children: String | ReactNode;
}

export default function Navlink({ href, children }: NavlinkProps) {
  const router = useRouter();

  return (
    <Link
      className={
        router.pathname === href
          ? "p-4 sm:p-6 bg-slate-600 text-white hover:bg-slate-600 transition-all font-semibold text-lg"
          : "p-4 sm:p-6 bg-slate-700 text-white hover:bg-slate-600 transition-all font-semibold text-lg"
      }
      href={href}
    >
      {children}
    </Link>
  );
}
