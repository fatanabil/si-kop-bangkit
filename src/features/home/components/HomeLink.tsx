import Link from "next/link";
import { type ReactNode } from "react";

interface HomeLinkPropsType {
  href: string;
  children: string | ReactNode;
}

export const HomeLink = ({ href, children, ...props }: HomeLinkPropsType) => {
  return (
    <Link
      className="relative px-8 py-8 text-2xl font-semibold text-amber-400 after:absolute after:left-1/2 after:top-[75%] after:h-1 after:w-[30%] after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-amber-400 after:transition-all after:duration-300 after:content-['_'] after:hover:scale-x-100"
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
};
