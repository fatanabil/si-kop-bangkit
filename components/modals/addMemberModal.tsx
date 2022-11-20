import CloseButton from "../buttons/closeButton";
import { useState, FormEvent } from "react";

interface AddMemberModalProps {
  addOpen: boolean;
  setAddOpen: Function;
  baseURL: string;
}

export default function AddMemberModal({
  addOpen,
  setAddOpen,
  baseURL,
}: AddMemberModalProps) {
  const [noRek, setNoRek] = useState<string>("0000000000");
  const [nmAnggota, setNmAnggota] = useState<string>("");
  const [nmInstansi, setNmInstansi] = useState<string>("");

  const onSubmitNewMemberHandler = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const post = await fetch(`${baseURL}/api/member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        no_rek: noRek,
        nama_anggota: nmAnggota,
        nama_instansi: nmInstansi,
      }),
    });
    const result = await post.json();
    if (post.ok) {
      setAddOpen(false);
    }
  };

  return (
    <>
      {addOpen && (
        <div className="h-screen w-full fixed z-10 top-0 left-0 bg-black opacity-20 transition-all"></div>
      )}
      <div className="w-5/6 bg-slate-800 rounded-lg p-8 fixed z-20 shadow-xl top-10 left-1/2 -translate-x-1/2 transition-all md:w-2/4 lg:w-2/5">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl text-white font-semibold">Tambah Anggota</h3>
          <CloseButton onClick={() => setAddOpen(false)} />
        </div>
        <hr className="my-4 border-2 border-slate-600 bg-slate-600 rounded-full" />
        <form
          action=""
          onSubmit={(ev) => onSubmitNewMemberHandler(ev)}
          className="flex flex-col"
        >
          <div className="flex flex-col mt-4">
            <label htmlFor="no-rek" className="text-xl text-slate-200 mb-2">
              No Rekening
            </label>
            <input
              type="number"
              name="no-rek"
              id="no-rek"
              className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              onChange={(ev) => setNoRek(ev.target.value.toString())}
              value={noRek}
              min={0}
              max={10}
              required={true}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="nama-anggota"
              className="text-xl text-slate-200 mb-2"
            >
              Nama Anggota
            </label>
            <input
              type="text"
              name="nama-anggota"
              id="nama-anggota"
              className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              onChange={(ev) => setNmAnggota(ev.target.value.toUpperCase())}
              value={nmAnggota}
              required={true}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="nama-instansi"
              className="text-xl text-slate-200 mb-2"
            >
              Instansi
            </label>
            <input
              type="select"
              name="nama-instansi"
              list="agency-name"
              id="nama-instansi"
              className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
              onChange={(ev) => setNmInstansi(ev.target.value)}
              value={nmInstansi}
              required={true}
            />
          </div>
          <div className="my-4"></div>
          <button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-lg text-slate-200 rounded-md hover:bg-teal-800 transition-all duration-300 self-end"
          >
            Tambah
          </button>
        </form>
      </div>
    </>
  );
}
