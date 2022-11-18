import HomeLink from "../components/homelink";
import Layout from "../components/layout";
import Navbar from "../components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-800 flex flex-col justify-center items-center">
        <h1 className="text-white text-center text-3xl">
          SISTEM CEK TAGIHAN KOPERASI BANGKIT BERSAMA
        </h1>
        <div className="flex flex-col items-center mt-4 sm:flex-row">
          <HomeLink href={"/member"}>Anggota</HomeLink>
          <HomeLink href={"/agency"}>Instansi</HomeLink>
          <HomeLink href={"/mutation"}>Mutasi</HomeLink>
          <HomeLink href={"/invoice"}>Tagihan</HomeLink>
        </div>
      </div>
    </>
  );
}
