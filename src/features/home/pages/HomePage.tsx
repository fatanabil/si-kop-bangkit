import { HomeLink } from "~/features/home/components/HomeLink";

import Layout from "~/components/Layouts/Layout";
import withAuth from "~/hoc/withAuth";

const Home = () => {
  return (
    <Layout page="Beranda">
      <section className="flex w-full flex-1 flex-col items-center justify-center bg-slate-800">
        <h1 className="text-center text-3xl text-white">
          SISTEM CEK TAGIHAN KOPERASI BANGKIT BERSAMA
        </h1>
        <div className="mt-4 flex flex-col items-center sm:flex-row">
          <HomeLink href={"/anggota"}>Anggota</HomeLink>
          <HomeLink href={"/instansi"}>Instansi</HomeLink>
          <HomeLink href={"/mutasi"}>Mutasi</HomeLink>
          <HomeLink href={"/tagihan"}>Tagihan</HomeLink>
        </div>
      </section>
    </Layout>
  );
};

export default withAuth(Home);
