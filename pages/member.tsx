import { useEffect, useState } from "react";
import SearchButton from "../components/buttons/searchButton";
import Layout from "../components/layout";
import MemberType from "../types/memberType";
import URLS from "../utils/url";

interface MemberProps {
  memberData: MemberType[];
  baseURL: string;
}

export default function Member(props: MemberProps) {
  const { baseURL } = props;
  const [memberData, setMemberData] = useState<MemberType[]>(
    () => props.memberData
  );
  const [nmAnggota, setNmAnggota] = useState<string>("");
  const [nmInstansi, setNmInstansi] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSearchMemberDataHandler = async () => {
    setLoading(true);
    const response = await fetch(
      `${baseURL}/api/member?nama=${nmAnggota}&limit=20`
    );
    const result = await response.json();

    if (response.ok) {
      setMemberData(result.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.onkeydown = async (ev) => {
      if (ev.key === "Enter") {
        await onSearchMemberDataHandler();
      }
    };
  });

  return (
    <Layout>
      <div className="flex flex-col justify-between md:flex-row">
        <h2 className="text-3xl font-semibold text-slate-200">
          Daftar Anggota
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0">
          {/* <AddButton onClick={setIsOpen}>Tambah Anggota</AddButton> */}
          <input
            type="text"
            placeholder="Cari Nama Anggota"
            className="w-full px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0 sm:w-56"
            onChange={(ev) => setNmAnggota(ev.target.value)}
          />
          <input
            inlist="select"
            list="agency-name"
            placeholder="Cari berdasarkan instansi"
            className="ml-0 w-full px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0 sm:w-64"
            onChange={(ev) => setNmInstansi(ev.target.value)}
          />
          <SearchButton loading={loading} onClick={onSearchMemberDataHandler} />
        </div>
        {/* {agencyName && (
            <AgencyNameList agencyName={agencyName} forSearch={true} />
          )} */}
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
    </Layout>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${URLS.BASE_URL}/api/member?limit=20`, {
    method: "GET",
  });
  const { data: memberData } = await response.json();

  return {
    props: {
      memberData,
      baseURL: URLS.BASE_URL,
    },
  };
}
