import { type Instansi } from "@prisma/client";
import { useRouter } from "next/router";
import { type ChangeEvent, useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";
import Input from "~/components/Input";
import Layout from "~/components/Layouts/Layout";
import Loader from "~/components/Loader";
import SectionDivider from "~/components/SectionDivider";
import Table from "~/components/Table/Table";
import TableBody from "~/components/Table/TableBody";
import TableBodyRow from "~/components/Table/TableBodyRow";
import TableBodyRowItem from "~/components/Table/TableBodyRowItem";
import TableHead from "~/components/Table/TableHead";
import TableHeadItem from "~/components/Table/TableHeadItem";
import useDebounce from "~/hooks/useDebounce";
import useModal from "~/hooks/useModal";
import { api } from "~/utils/api";
import AddInstansiModal from "../modals/AddInstansiModal";
import ConfirmDeleteInstansiModal from "../modals/ConfirmDeleteInstansiModal";
import EditInstansiModal from "../modals/EditInstansiModal";
import withAuth from "~/hoc/withAuth";

const InstansiPage = () => {
  const router = useRouter();
  const { nama_instansi } = router.query;
  const [searchByName, setSearchByName] = useState(
    (nama_instansi as string) ?? "",
  );
  const searchByNameDebounce = useDebounce(searchByName, 500);

  const { data, isPending } = api.instansi.getInstansi.useQuery({
    searchByName: searchByNameDebounce,
  });

  const addInstansiModal = useModal();
  const editInstansiModal = useModal<Instansi>();
  const confirmDeleteInstansiModal = useModal<Instansi>();

  const handleOnChangeSearchByName = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchByName(ev.target.value.toUpperCase());
  };

  const handleOnClickEditInstansi = (data_instansi: Instansi) => {
    editInstansiModal.setData(data_instansi);
    editInstansiModal.openModal();
  };

  const handleOnClickDeleteInstansi = (data_instansi: Instansi) => {
    confirmDeleteInstansiModal.setData(data_instansi);
    confirmDeleteInstansiModal.openModal();
  };

  useEffect(() => {
    if (searchByNameDebounce) {
      void router.push(`/instansi?nama_instansi=${searchByNameDebounce}`);
    }
  }, [searchByNameDebounce]);

  return (
    <Layout page="Instansi">
      <section className="flex flex-col justify-between gap-8 md:gap-4 lg:flex-row">
        <h1 className="text-3xl font-semibold text-slate-200">
          Daftar Instansi
        </h1>
        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            prefixIcon={<FiPlus />}
            onClick={addInstansiModal.openModal}
          >
            Tambah Instansi
          </Button>
          <Input
            placeholder="Cari Instansi"
            onChange={(ev) => handleOnChangeSearchByName(ev)}
            value={searchByName}
          />
        </div>
      </section>
      <SectionDivider />
      <section className="rounded-lg bg-slate-700 p-4 text-xs shadow-lg sm:p-8 sm:text-base">
        <Table>
          <TableHead>
            <TableHeadItem className="w-full min-w-12 max-w-16 py-2 text-center">
              No.
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-24 max-w-36 py-2">
              Kode Instansi
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-40 max-w-lg py-2">
              Nama Instansi
            </TableHeadItem>
            <TableHeadItem className="sticky right-0 w-full min-w-24 max-w-28 bg-slate-700 px-3 py-2">
              Aksi
            </TableHeadItem>
          </TableHead>
          <TableBody>
            {isPending ? (
              <TableBodyRow className="flex w-full justify-center py-6">
                <Loader />
              </TableBodyRow>
            ) : (
              data?.instansi.map((instansi, i) => (
                <TableBodyRow key={instansi.id}>
                  <TableBodyRowItem className="w-full min-w-12 max-w-16 py-2">
                    {++i}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-24 max-w-36 py-2 text-left">
                    {instansi.kode_ins}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-40 max-w-lg py-2 text-left">
                    {instansi.nama_ins}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="sticky right-0 flex w-full min-w-24 max-w-28 gap-2 bg-slate-700 px-3 py-2 lg:bg-transparent">
                    <IconButton
                      title="Edit"
                      className="bg-amber-400 hover:bg-amber-500"
                      icon={<FiEdit />}
                      onClick={() => handleOnClickEditInstansi(instansi)}
                    />
                    <IconButton
                      title="Hapus"
                      icon={<FiTrash />}
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleOnClickDeleteInstansi(instansi)}
                    />
                  </TableBodyRowItem>
                </TableBodyRow>
              ))
            )}
          </TableBody>
        </Table>
        {data?.instansi.length === 0 && (
          <p className="mt-4 w-full text-center">
            Instansi dengan nama{" "}
            <span className="font-semibold text-amber-400">
              {searchByNameDebounce}
            </span>{" "}
            tidak ditemukan
          </p>
        )}
      </section>
      {data?.instansi.at(-1) && (
        <AddInstansiModal
          lastInstansiRecord={data.instansi.at(-1)}
          {...addInstansiModal}
        />
      )}
      <EditInstansiModal
        data_instansi={editInstansiModal.data}
        {...editInstansiModal}
      />
      <ConfirmDeleteInstansiModal
        data_instansi={confirmDeleteInstansiModal.data}
        {...confirmDeleteInstansiModal}
      />
    </Layout>
  );
};

export default withAuth(InstansiPage);
