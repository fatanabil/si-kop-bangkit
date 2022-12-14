import { MutationDataErrType } from "../../types";

interface MutationErrorFlashProps {
  err: MutationDataErrType[];
}

export default function MutationErrorFlash({ err }: MutationErrorFlashProps) {
  return (
    <div className="bg-red-400 p-6 rounded-md flex flex-col gap-4 text-white border-2 border-red-500">
      {err.filter((dt: MutationDataErrType) => dt.dup && !dt.empty).length >
        0 && (
        <div>
          <p className="font-semibold">Nama duplikat, berikan nama spesifik</p>
          <ol>
            {err.map((dt: MutationDataErrType, i) => {
              if (dt.dup) {
                return (
                  <li key={i}>
                    {dt.nama} | {dt.dari}
                  </li>
                );
              }
            })}
          </ol>
        </div>
      )}
      {err.filter((dt: MutationDataErrType) => dt.empty && !dt.dup).length >
        0 && (
        <div>
          <p className="font-semibold">Nama tidak ditemukan</p>
          <ul>
            {err.map((dt: MutationDataErrType, i) => {
              if (dt.empty) {
                return (
                  <li key={i}>
                    {dt.nama} | {dt.dari}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
      {err.filter((dt: MutationDataErrType) => dt.empty && dt.dup).length >
        0 && (
        <div>
          <h5 className="font-semibold">Data tidak boleh kosong!</h5>
          <p>Mohon isi data atau hapus baris</p>
        </div>
      )}
    </div>
  );
}
