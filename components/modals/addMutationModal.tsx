import { useContext, useState } from "react";
import AuthContext from "../../contexts/authContext";
import { AgencyType, MutationDataErrType } from "../../types";
import AddButton from "../buttons/addButton";
import CloseButton from "../buttons/closeButton";
import DeleteButton from "../buttons/deleteButton";
import MutationErrorFlash from "../flash/mutationErrorFlash";

interface AddMutationModalProps {
  setOpenModal: Function;
  agencyName: AgencyType[];
  baseURL: string;
}

export default function AddMutationModal({
  setOpenModal,
  agencyName,
  baseURL,
}: AddMutationModalProps) {
  const { authData } = useContext(AuthContext);
  const thisMonth = `${new Date().getFullYear()}-${
    (new Date().getMonth() + 1).toString().length < 2
      ? `0${new Date().getMonth() + 1}`
      : `${new Date().getMonth() + 1}`
  }`;
  const [mutationData, setMutationData] = useState([
    {
      nama: "",
      dari: "",
      ke: "",
      bulan: thisMonth,
    },
  ]);
  const [err, setErr] = useState<MutationDataErrType[]>([]);

  const addInputHandle = () => {
    setMutationData([
      ...mutationData,
      { nama: "", dari: "", ke: "", bulan: thisMonth },
    ]);
  };

  const onDeleteInputHandle = (i: number) => {
    if (mutationData.length > 1) {
      mutationData.splice(i, 1);
      setMutationData([...mutationData]);
    }
    return;
  };

  const onChangeNameHandle = (nama: string, i: number) => {
    const newData = mutationData.map((dt, index) => {
      if (index === i) {
        return {
          ...dt,
          nama: nama.toUpperCase(),
        };
      }
      return dt;
    });

    setMutationData(newData);
  };

  const onChangeFromHandle = (dari: string, i: number) => {
    const newData = mutationData.map((dt, index) => {
      if (index === i) {
        return {
          ...dt,
          dari,
        };
      }

      return dt;
    });

    setMutationData(newData);
  };

  const onChangeToHandle = (ke: string, i: number) => {
    const newData = mutationData.map((dt, index) => {
      if (index === i) {
        return {
          ...dt,
          ke,
        };
      }

      return dt;
    });

    setMutationData(newData);
  };

  const onChangeMonthHandle = (bulan: string, i: number) => {
    const newData = mutationData.map((dt, index) => {
      if (index === i) {
        return {
          ...dt,
          bulan,
        };
      }

      return dt;
    });

    setMutationData(newData);
  };

  const onSubmitMutationHandle = async () => {
    let parsedData: any[] = [];
    try {
      parsedData = mutationData.map((data) => {
        const kdInsDari = agencyName.filter(
          (agency) => agency.nama_ins === data.dari
        )[0].kode_ins;
        const kdInsKe = agencyName.filter(
          (agency) => agency.nama_ins === data.ke
        )[0].kode_ins;
        return { ...data, dari: kdInsDari, ke: kdInsKe };
      });
    } catch (err) {
      setErr([{ nama: "Instansi Kosong", dari: "", empty: true, dup: true }]);
    } finally {
      setTimeout(() => {
        setErr([]);
      }, 5000);
    }

    const patch = await fetch(`${baseURL}/api/mutation`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: authData.token,
      },
      body: JSON.stringify({ mutationData: parsedData }),
    });
    const result = await patch.json();
    if (patch.ok) {
      setOpenModal(false);
    } else {
      if (patch.status === 400) {
        setErr(result.data?.err);
      }
    }

    setTimeout(() => {
      setErr([]);
    }, 5000);
  };

  return (
    <div>
      <div className="h-screen w-full fixed z-10 top-0 left-0 bg-black opacity-20 transition-all"></div>
      <div className="w-[95%] max-h-[85%] overflow-auto bg-slate-800 rounded-lg p-4 md:p-8 fixed z-20 shadow-xl top-10 left-1/2 -translate-x-1/2 transition-all backdrop-brightness-75 sm:w-[90%] lg:w-5/6 xl:w-4/6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl text-white font-semibold">Tambah Mutasi</h3>
            <CloseButton
              onClick={() => {
                setOpenModal(false);
              }}
            />
          </div>
          <hr className="my-4 border-2 border-slate-600 bg-slate-600 rounded-full" />
          {err.length > 0 && <MutationErrorFlash err={err} />}
          <div className="overflow-y-auto">
            <table>
              <thead className="text-white">
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Dari</th>
                  <th>Ke</th>
                  <th>Bulan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mutationData.map((dt, i) => (
                  <tr key={i}>
                    <td className="text-white text-center">{i + 1}</td>
                    <td className="p-1">
                      <input
                        type="text"
                        value={dt.nama}
                        className="w-full px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                        onChange={(ev) =>
                          onChangeNameHandle(ev.target.value, i)
                        }
                      />
                    </td>
                    <td className="p-1">
                      <input
                        inlist="select"
                        list="agency-name"
                        value={dt.dari}
                        className="w-full px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                        onChange={(ev) =>
                          onChangeFromHandle(ev.target.value, i)
                        }
                      />
                    </td>
                    <td className="p-1">
                      <input
                        inlist="select"
                        list="agency-name"
                        value={dt.ke}
                        className="w-full px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                        onChange={(ev) => onChangeToHandle(ev.target.value, i)}
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="month"
                        value={dt.bulan}
                        className="w-24 sm:w-full px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                        onChange={(ev) =>
                          onChangeMonthHandle(ev.target.value, i)
                        }
                      />
                    </td>
                    <td className="p-1 text-center">
                      <button onClick={() => {}}>
                        <DeleteButton
                          onClick={() => onDeleteInputHandle(i)}
                          className="text-red-500 hover:text-red-400"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 justify-end mt-2">
            <button
              className="p-1 border-2 border-emerald-600 rounded-md hover:bg-emerald-600 transition-all group"
              onClick={addInputHandle}
            >
              <AddButton className="text-emerald-600 p-2 group-hover:text-white transition-all" />
            </button>
          </div>
          <div className="flex w-full justify-end my-4">
            <button
              className="bg-emerald-600 px-4 py-2 text-white rounded-md hover:bg-emerald-500"
              onClick={onSubmitMutationHandle}
            >
              Submit Data
            </button>
          </div>
        </div>
      </div>
      {agencyName && (
        <datalist id="agency-name">
          {agencyName.map((item, i) => (
            <option value={item.nama_ins} key={i}>
              {item.nama_ins}
            </option>
          ))}
        </datalist>
      )}
    </div>
  );
}
