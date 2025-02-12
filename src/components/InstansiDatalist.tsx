import { api } from "~/utils/api";

const InstansiDatalist = () => {
  const { data, isLoading } = api.instansi.getAgencyList.useQuery();

  if (!isLoading) {
    return (
      <datalist id="agency-name">
        {data?.instansi.map((ins) => (
          <option
            key={ins.id}
            value={ins.nama_ins}
            data-code={ins.kode_ins}
            data-id={ins.id}
          >
            {ins.nama_ins}
          </option>
        ))}
      </datalist>
    );
  }
};

export default InstansiDatalist;
