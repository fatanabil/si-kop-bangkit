import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import HomeLink from "../components/homelink";
import Navbar from "../components/navbar";
import AuthContext from "../contexts/authContext";
import { AuthContextType } from "../types";

export default function Home() {
  const { authData } = useContext<AuthContextType>(AuthContext);
  const [load, setLoad] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoad(false);
    if (!authData.isAuthenticated) {
      router.push("/login");
      setLoad(true);
    }
  }, []);

  if (load) {
    return null;
  }

  return (
    <>
      <Head>
        <title>SI-KOP-BANGKIT | Beranda</title>
      </Head>
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
