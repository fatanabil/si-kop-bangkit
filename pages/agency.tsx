import { useState, useEffect, useContext } from "react";
import AddButton from "../components/buttons/addButton";
import Layout from "../components/layout";
import { AgencyType } from "../types";
import URLS from "../utils/url";
import { useDebounce } from "use-debounce";
import AuthContext from "../contexts/authContext";
import { useRouter } from "next/router";
import AddAgencyModal from "../components/modals/addAgencyModal";

interface AgencyProps {
  baseURL: string;
}

export default function Agency({ baseURL }: AgencyProps) {
  const router = useRouter();
  const { authData, changeAuthData } = useContext(AuthContext);
  const [agencyData, setAgencyData] = useState<AgencyType[]>([]);
  const [nmInstansi, setNmInstansi] = useState<string>("");
  const [insDe] = useDebounce(nmInstansi, 500);
  const [openAddModal, setOpenAddModal] = useState(false);

  const onSearchAgencyDataHandler = async (val1: string) => {
    const response = await fetch(`${baseURL}/api/agency?nama_ins=${val1}`, {
      headers: {
        authorization: authData.token,
      },
    });
    const { data, refreshToken } = await response.json();
    if (response.ok) {
      if (refreshToken) {
        changeAuthData({ ...authData, token: refreshToken });
      }
      setAgencyData(data);
    } else {
      if (response.status === 401) {
        changeAuthData({ username: "", token: "", isAuthenticated: false });
        return router.replace("/login");
      }
    }
  };

  useEffect(() => {
    onSearchAgencyDataHandler(insDe);
  }, [insDe]);

  return (
    <Layout title="SI-KOP-BANGKIT | Instansi">
      <div className="flex flex-col justify-between md:flex-row">
        <h2 className="text-3xl font-semibold text-slate-200">
          Daftar Instansi
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0">
          <AddButton onClick={() => setOpenAddModal(true)}>
            Tambah Instansi
          </AddButton>
          <input
            type="text"
            placeholder="Cari Nama Instansi"
            className="px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0"
            value={nmInstansi}
            onChange={(ev) => setNmInstansi(ev.target.value.toUpperCase())}
          />
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
            {agencyData &&
              (agencyData.length === 0 ? (
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
              ))}
          </tbody>
        </table>
      </div>
      {openAddModal && (
        <AddAgencyModal
          setOpenAddModal={setOpenAddModal}
          lastId={agencyData[agencyData.length - 1].kode_ins}
          baseURL={baseURL}
        />
      )}
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
