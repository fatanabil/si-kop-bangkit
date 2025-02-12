import Image from "next/image";
import Link from "next/link";

const custom404 = () => {
  return (
    <div className="grid min-h-screen w-full place-content-center bg-slate-800 text-center text-white">
      <Image src="/404.webp" alt="404-illustration" width={300} height={300} />
      <h1 className="mt-8">Oops... Halaman yang Anda cari tidak ada</h1>
      <Link href="/" className="mt-8 underline">
        Kembali ke Home
      </Link>
    </div>
  );
};

export default custom404;
