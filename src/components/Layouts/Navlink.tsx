import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";

type NavlinkPropsType = {
  href: string;
  children: string | ReactNode;
};

const Navlink = ({ href, children }: NavlinkPropsType) => {
  const router = useRouter();

  return (
    <Link
      className={
        router.pathname === href
          ? "bg-slate-600 p-4 text-lg font-semibold text-white transition-all hover:bg-slate-600 sm:p-6"
          : "bg-slate-700 p-4 text-lg font-semibold text-white transition-all hover:bg-slate-600 sm:p-6"
      }
      href={href}
    >
      {children}
    </Link>
  );
};

export default Navlink;
