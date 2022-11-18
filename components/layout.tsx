import { ReactNode } from "react";
import Navbar from "./navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-slate-800">
        <div className="px-4 pt-24 pb-16 sm:px-8 md:px-16">{children}</div>
      </main>
    </div>
  );
}
