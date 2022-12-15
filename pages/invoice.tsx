import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import DeleteButton from "../components/buttons/deleteButton";
import RefreshButton from "../components/buttons/refreshButton";
import Layout from "../components/layout";
import AddNotListedMemberModal from "../components/modals/addNotListedMemberModal";
import NotListedDataModal from "../components/modals/notListedDataModal";
import UseTextInputModal from "../components/modals/useTextInputModal";
import AuthContext from "../contexts/authContext";
import { InvoiceListedDataType } from "../types";
import formatNumber from "../utils/formatNumber";
import URLS from "../utils/url";

interface InvoiceProps {
  baseURL: string;
}

export default function Invoice({ baseURL }: InvoiceProps) {
  const router = useRouter();
  const { authData, changeAuthData } = useContext(AuthContext);
  const [listedData, setListedData] = useState<InvoiceListedDataType[]>([]);
  const [notListedData, setNotListedData] = useState([]);
  const [openInputText, setOpenInputText] = useState(false);
  const [notListedModalOpen, setNotListedModalOpen] = useState(true);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [agencyData, setAgencyData] = useState([]);
  const total =
    listedData.length > 0
      ? listedData.map((dt) => dt.jumlah).reduce((total, curr) => total + curr)
      : 0;
  const [refresh, setRefresh] = useState(1);
  const [loading, setLoading] = useState(false);

  const doRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const deleteAllData = () => {
    setListedData([]);
    setNotListedData([]);
    localStorage.removeItem("LISTED_DATA");
    localStorage.removeItem("NOT_LISTED_DATA");
    localStorage.removeItem("SERIALIZED_DATA");
    return;
  };

  const getAgencyData = async () => {
    const response = await fetch(`${baseURL}/api/agency`, {
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

  const checkInvoiceData = async () => {
    const invoiceData =
      JSON.parse(localStorage.getItem("SERIALIZED_DATA") as string) || [];
    if (invoiceData.length !== 0) {
      setLoading(true);
      const post = await fetch(`${baseURL}/api/invoice/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authData.token,
        },
        body: JSON.stringify({ invoiceData }),
      });
      const { data } = await post.json();
      if (post.ok) {
        const { listedData, notListedData } = data;
        setListedData(listedData);
        setNotListedData(notListedData);
        localStorage.setItem("LISTED_DATA", JSON.stringify(listedData));
        localStorage.setItem("NOT_LISTED_DATA", JSON.stringify(notListedData));
        setOpenInputText(false);
        setNotListedModalOpen(true);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgencyData();
    setListedData(
      JSON.parse(localStorage.getItem("LISTED_DATA") as string) || []
    );
    setNotListedData(
      JSON.parse(localStorage.getItem("NOT_LISTED_DATA") as string) || []
    );
  }, []);

  useEffect(() => {
    checkInvoiceData();
  }, [refresh]);

  return (
    <Layout title="SI-KOP-BANGKIT | Tagihan">
      <div className="flex flex-col gap-4 md:flex-row justify-between">
        <h2 className="text-3xl font-semibold text-slate-200">
          Halaman Tagihan
        </h2>
        {listedData.length > 0 || notListedData.length > 0 ? (
          <div className="flex gap-4">
            <RefreshButton doRefresh={doRefresh} loading={loading} />
            <button
              className="px-4 py-2 bg-teal-600 text-slate-200 rounded-md hover:bg-teal-500 transition-all duration-300"
              onClick={() => {}}
            >
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Excel
              </div>
            </button>
            <DeleteButton onClick={deleteAllData}>Delete Data</DeleteButton>
          </div>
        ) : null}
        {listedData.length === 0 && notListedData.length === 0 && (
          <div className="flex flex-col gap-4 md:flex-row">
            <button
              className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition-all duration-300"
              onClick={() => setOpenInputText(true)}
            >
              Input text
            </button>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-slate-500 text-xl">
          Total : {formatNumber(total)}
        </h2>
      </div>
      <hr className="my-6 border-2 border-slate-600 bg-none" />
      <div className="bg-slate-700 text-[10px] p-4 rounded-lg shadow-lg sm:p-8 sm:text-base">
        <table className="w-full text-slate-200">
          <thead>
            <tr>
              <th className="w-16 uppercase">No.</th>
              <th className="w-24 p-2 uppercase">No. Rekening</th>
              <th className="w-64 p-2 uppercase">Nama Anggota</th>
              <th className="w-56 p-2 uppercase">Instansi</th>
              <th className="w-56 p-2 uppercase">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {listedData.length < 1 ? (
              <tr>
                <td colSpan={5} className="text-center font-semibold">
                  Upload file / Input dengan text
                </td>
              </tr>
            ) : (
              listedData.map((item: InvoiceListedDataType, index: number) => {
                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-600 transition-all duration-100"
                  >
                    <td className="text-center py-2">{++index}</td>
                    <td className="w-56">{`${item.no_rek.substring(
                      0,
                      7
                    )}***`}</td>
                    <td className="">{item.nama_anggota}</td>
                    <td className="">{item.detail_ins.nama_ins}</td>
                    <td className="">{formatNumber(item.jumlah)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {notListedData.length > 0 && notListedModalOpen && (
        <NotListedDataModal
          notListedData={notListedData}
          setNotListedModalOpen={setNotListedModalOpen}
          setAddMemberOpen={setAddMemberOpen}
          notListedModalOpen={notListedModalOpen}
        />
      )}
      {openInputText && (
        <UseTextInputModal
          setOpenInputText={setOpenInputText}
          baseURL={baseURL}
          setListedData={setListedData}
          setNotListedData={setNotListedData}
          setNotListedModalOpen={setNotListedModalOpen}
        />
      )}
      {addMemberOpen && (
        <AddNotListedMemberModal
          agencyData={agencyData}
          addMemberOpen={addMemberOpen}
          setAddMemberOpen={setAddMemberOpen}
          notListedData={notListedData}
          baseURL={baseURL}
          doRefresh={doRefresh}
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
