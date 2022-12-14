import Layout from "../components/layout";

export default function Invoice() {
  return (
    <Layout title="SI-KOP-BANGKIT | Tagihan">
      <div className="flex flex-col gap-4 md:flex-row justify-between">
        <h2 className="text-3xl font-semibold text-slate-200">
          Halaman Tagihan
        </h2>
        {/* {data.length > 0 || notListed.length > 0 ? (
            <div className="flex gap-4">
              <RefreshButton onRefresh={onRefreshHandle} loading={loading} />
              <button
                className="px-4 py-2 bg-teal-600 text-slate-200 rounded-md hover:bg-teal-500 transition-all duration-300"
                onClick={downloadExcel}
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
              <button
                className="px-4 py-2 bg-rose-500 text-slate-200 rounded-md hover:bg-rose-400 transition-all duration-300 flex items-center gap-2"
                onClick={() => deleteData()}
              >
                <DeleteIcon fill="text-slate-200" />
                Delete Data
              </button>
            </div>
          ) : null}
          {data.length === 0 && notListed.length === 0 && (
            <div className="flex flex-col gap-4 md:flex-row">
              <button
                className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition-all duration-300"
                onClick={() => setUseText(!useText)}
              >
                Input text
              </button>
              <div className="lg:w-96 flex">
                <input
                  className="form-control block w-full px-3 py-2 text-base font-normal text-slate-200 bg-slate-500 bg-clip-padding rounded-l-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  accept=".csv, .xlsx, .xls"
                  type="file"
                  onChange={(e) => setFileStor(e.target.files[0])}
                />
                <button
                  className="px-4 py-2 bg-slate-600 text-slate-200 rounded-r-md hover:bg-slate-500 transition-all duration-300"
                  onClick={handleSubmit}
                >
                  Upload
                </button>
              </div>
            </div>
          )} */}
      </div>
      <div>
        <h2 className="text-slate-500 text-xl">Total : {900}</h2>
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
            {/* {data.length < 1 ? (
              <tr>
                <td colSpan={5} className="text-center font-semibold">
                  Upload file / Input dengan text
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
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
                    <td className="">{item.jumlah}</td>
                  </tr>
                );
              })
            )} */}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
