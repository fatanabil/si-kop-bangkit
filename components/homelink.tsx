import Link from "next/link";
import { ReactNode } from "react";

interface HomeLinkProps {
  href: string;
  children: string | ReactNode;
}

export default function HomeLink({ href, children }: HomeLinkProps) {
  return (
    <Link
      className="px-8 py-8 text-amber-400 text-2xl font-semibold relative after:content-['_'] after:absolute after:h-1 after:bg-amber-400 after:rounded-full after:w-[30%] after:top-[75%] after:left-1/2 after:-translate-x-1/2 after:scale-x-0 after:hover:scale-x-100 after:transition-all after:duration-300"
      href={href}
    >
      {children}
    </Link>
  );
}
