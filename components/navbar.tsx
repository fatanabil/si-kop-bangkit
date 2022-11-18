import Link from "next/link";
import Navlink from "./linknav";

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-700 fixed overflow-x-scroll sm:overflow-hidden shadow-lg">
      <div className="w-full">
        <div className="h-full w-full flex px-0 gap-8 sm:gap-0 sm:px-16 justify-between">
          <div className="h-full flex px-0">
            <Navlink href={"/"}>Home</Navlink>
            <Navlink href={"/member"}>Anggota</Navlink>
            <Navlink href={"/agency"}>Instansi</Navlink>
            <Navlink href={"/mutation"}>Mutasi</Navlink>
            <Navlink href={"/invoice"}>Tagihan</Navlink>
          </div>
          <button
            className="border-2 border-red-400 rounded-md px-4 py-1 text-red-400 hover:text-white hover:bg-red-400 transition-all duration-200 self-center"
            onClick={() => {}}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
