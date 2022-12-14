import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import AddButton from "../components/buttons/addButton";
import Layout from "../components/layout";
import AddMemberModal from "../components/modals/addMemberModal";
import AuthContext from "../contexts/authContext";
import { AgencyType, MemberType } from "../types";
import URLS from "../utils/url";

interface MemberProps {
  baseURL: string;
}

export default function Member({ baseURL }: MemberProps) {
  const router = useRouter();
  const { authData, changeAuthData } = useContext(AuthContext);
  const [memberData, setMemberData] = useState<MemberType[]>([]);
  const [agencyData, setAgencyData] = useState<AgencyType[]>([]);
  const [nmAnggota, setNmAnggota] = useState<string>("");
  const [nmInstansi, setNmInstansi] = useState<string>("");
  const [aggDe] = useDebounce(nmAnggota, 500);
  const [insDe] = useDebounce(nmInstansi, 500);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  const onSearchMemberDataHandler = async (val1: string, val2: string) => {
    const response = await fetch(
      `${baseURL}/api/member?nama=${val1}&instansi=${val2}&limit=20`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authData.token,
        },
      }
    );
    const { data, refreshToken } = await response.json();

    if (response.ok) {
      if (refreshToken) {
        changeAuthData({ ...authData, token: refreshToken });
      }
      setMemberData(data);
    } else {
      if (response.status === 401) {
        changeAuthData({ username: "", token: "", isAuthenticated: false });
        return router.replace("/login");
      }
    }
  };

  useEffect(() => {
    onSearchMemberDataHandler(aggDe, insDe);
  }, [aggDe, insDe]);

  useEffect(() => {
    const getAgencyData = async () => {
      const response = await fetch(`${baseURL}/api/agency`, {
        method: "GET",
        headers: {
          authorization: authData.token,
        },
      });
      const { data } = await response.json();
      if (response.ok) {
        setAgencyData(data);
      }
    };

    getAgencyData();
  }, []);

  return (
    <Layout title="SI-KOP-BANGKIT | Anggota">
      <div className="flex flex-col justify-between md:flex-row">
        <h2 className="text-3xl font-semibold text-slate-200">
          Daftar Anggota
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0">
          <AddButton onClick={() => setAddOpen(!addOpen)}>
            Tambah Anggota
          </AddButton>
          <input
            type="text"
            placeholder="Cari Nama Anggota"
            className="w-full px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0 sm:w-56"
            onChange={(ev) => setNmAnggota(ev.target.value.toUpperCase())}
            value={nmAnggota}
          />
          <input
            inlist="select"
            list="agency-name"
            placeholder="Cari berdasarkan instansi"
            className="ml-0 w-full px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0 sm:w-64"
            onChange={(ev) => setNmInstansi(ev.target.value)}
            value={nmInstansi}
          />
        </div>
        <datalist id="agency-name">
          {agencyData &&
            agencyData.map((agency) => (
              <option key={agency._id} value={agency.nama_ins}>
                {agency.nama_ins}
              </option>
            ))}
        </datalist>
      </div>
      <hr className="my-8 border-2 border-slate-600 bg-none" />
      <div className="bg-slate-700 text-xs p-4 rounded-lg shadow-lg sm:p-8 sm:text-base">
        <table className="w-full text-slate-200">
          <thead>
            <tr>
              <th className="w-8 uppercase">No.</th>
              <th className="w-36 p-2 uppercase">No Rek</th>
              <th className="w-80 p-2 uppercase">Nama</th>
              <th className="w-56 p-2 uppercase">Instansi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {memberData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center font-semibold">
                  Data Tidak Ditemukan
                </td>
              </tr>
            ) : (
              memberData.map((member, index) => {
                return (
                  <tr
                    key={member._id}
                    className="hover:bg-slate-600 transition-all duration-100"
                  >
                    <td className="text-center py-2">{++index}</td>
                    <td className="text-center">{`${member.no_rek.substring(
                      0,
                      7
                    )}***`}</td>
                    <td className="">{member.nama_anggota}</td>
                    <td className="">{member.detail_ins.nama_ins}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {addOpen && (
        <AddMemberModal
          baseURL={baseURL}
          addOpen={addOpen}
          setAddOpen={setAddOpen}
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
