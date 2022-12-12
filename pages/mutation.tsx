import { useContext, useEffect, useState } from "react";
import AddButton from "../components/buttons/addButton";
import Layout from "../components/layout";
import AuthContext from "../contexts/authContext";
import { MutationType } from "../types";
import URLS from "../utils/url";

interface MutationProps {
  baseURL: string;
}

export default function Mutation({ baseURL }: MutationProps) {
  const { authData, changeAuthData } = useContext(AuthContext);
  const [mutData, setMutData] = useState<MutationType[]>([]);
  const [bulan, setBulan] = useState(
    () =>
      `${new Date().getFullYear()}-${
        (new Date().getMonth() + 1).toString().length < 2
          ? `0${new Date().getMonth() + 1}`
          : `${new Date().getMonth() + 1}`
      }`
  );
  const [record, setRecord] = useState(0);

  const onSearchMutationData = async () => {
    const response = await fetch(`${baseURL}/api/mutation?bulan=${bulan}`, {
      method: "GET",
      headers: {
        authorization: authData.token,
      },
    });

    const { data, refreshToken } = await response.json();
    if (response.ok) {
      if (refreshToken) {
        changeAuthData({ ...authData, token: refreshToken });
      }
      setMutData(data);
      setRecord(data.length);
    }
  };

  useEffect(() => {
    onSearchMutationData();
  }, [bulan]);

  return (
    <Layout title="SI-KOP-BANGKIT | Mutasi">
      <div className="flex flex-col justify-between sm:flex-row">
        <h2 className="text-3xl font-semibold text-slate-200">Daftar Mutasi</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0">
          <AddButton onClick={() => {}}>Tambah Mutasi</AddButton>
          <input
            type="month"
            className="px-4 py-2 outline-none bg-slate-600 text-slate-200 rounded-md focus:ring-2 focus:ring-slate-400 transition-all sm:mt-0"
            value={bulan}
            onChange={(ev) => setBulan(ev.target.value)}
          />
        </div>
      </div>
      <h3 className="mt-4 text-xl text-slate-500 sm:mt-0">
        Jumlah data : {record}
      </h3>
      <hr className="my-6 border-2 border-slate-600 bg-none" />
      <div className="bg-slate-700 text-[10px] p-4 rounded-lg shadow-lg sm:p-8 sm:text-base">
        <table className="w-full text-slate-200">
          <thead>
            <tr>
              <th className="w-16 uppercase">No.</th>
              <th className="w-36 p-2 uppercase">Nama Anggota</th>
              <th className="w-56 p-2 uppercase">Asal Instansi</th>
              <th className="w-56 p-2 uppercase">Tujuan Instansi</th>
              <th className="w-56 p-2 uppercase">Bulan Mutasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mutData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center font-semibold">
                  Data Tidak Ditemukan
                </td>
              </tr>
            ) : (
              mutData &&
              mutData.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-600 transition-all duration-100"
                  >
                    <td className="text-center py-2">{++index}</td>
                    <td className="w-56">{item.no_rek.nama_anggota}</td>
                    <td className="">{item.dari.nama_ins}</td>
                    <td className="">{item.ke.nama_ins}</td>
                    <td className="">{item.bulan}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      baseURL: URLS.BASE_URL,
    },
  };
}
