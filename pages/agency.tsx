import { useState, useEffect } from "react";
import AddButton from "../components/buttons/addButton";
import SearchButton from "../components/buttons/searchButton";
import Layout from "../components/layout";
import InstansiType from "../types/instansiType";
import URLS from "../utils/url";

interface AgencyProps {
  agencyData: InstansiType[];
  baseURL: string;
}

export default function Agency(props: AgencyProps) {
  const [agencyData, setAgencyData] = useState<any[]>(() => props.agencyData);
  const [nmInstansi, setNmInstansi] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSearchAgencyDataHandler = async () => {
    setLoading(true);
    const response = await fetch(
      `${props.baseURL}/api/agency?nama_ins=${nmInstansi}`
    );
    const result = await response.json();
    if (response.ok) {
      setAgencyData(result.data);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.onkeydown = async (ev) => {
      if (ev.key === "Enter") {
        await onSearchAgencyDataHandler();
      }
    };
  });

  return (
    <Layout title="SI-KOP-BANGKIT | Instansi">
      <div className="flex flex-col justify-between md:flex-row">
        <h2 className="text-3xl font-semibold text-slate-200">
          Daftar Instansi
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0">
          <AddButton>Tambah Instansi</AddButton>
          <input
            type="text"
            placeholder="Cari Nama Instansi"
            className="px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0"
            onChange={(ev) => setNmInstansi(ev.target.value)}
          />
          <SearchButton onClick={onSearchAgencyDataHandler} loading={loading} />
        </div>
      </div>
      <hr className="my-8 border-2 border-slate-600 bg-none" />
      <div className="bg-slate-700 p-8 rounded-lg shadow-lg">
        <table className="w-full text-slate-200 transition-all">
          <thead>
            <tr>
              <th className="w-8 uppercase">No.</th>
              <th className="w-36 p-2 uppercase">kode Instansi</th>
              <th className="w-80 p-2 uppercase text-left">Nama Instansi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {agencyData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center font-semibold">
                  Data Tidak Ditemukan
                </td>
              </tr>
            ) : (
              agencyData.map((agency, index) => (
                <tr
                  key={agency.kode_ins}
                  className="hover:bg-slate-600 transition-all duration-100"
                >
                  <td className="text-center py-2">{++index}</td>
                  <td className="text-center">{agency.kode_ins}</td>
                  <td className="">{agency.nama_ins}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${URLS.BASE_URL}/api/agency`);
  const { data: agencyData } = await response.json();

  return {
    props: {
      agencyData,
      baseURL: URLS.BASE_URL,
    },
  };
}
