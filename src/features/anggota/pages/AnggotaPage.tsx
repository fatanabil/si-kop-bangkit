import { type Anggota } from "@prisma/client";
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
import { type AnggotaWithInstansi } from "~/schemas/anggota";
import { api } from "~/utils/api";
import AddAnggotaModals from "../modals/AddAnggotaModals";
import ConfirmDeleteAnggotaModal from "../modals/ComfirmDeleteAnggotaModal";
import EditAnggotaModal from "../modals/EditAnggotaModal";
import withAuth from "~/hoc/withAuth";

const AnggotaPage = () => {
  const router = useRouter();
  const { nama_anggota, nama_instansi } = router.query;
  const [searchByName, setSearchByName] = useState(nama_anggota as string);
  const [searchByInstansi, setSearchByInstansi] = useState(
    nama_instansi as string,
  );
  const searchByNameDebounce = useDebounce(searchByName, 500);
  const searchByInstansiDebounce = useDebounce(searchByInstansi, 500);

  const {
    isOpen: isOpenAdd,
    openModal: openModalAdd,
    closeModal: closeModalAdd,
  } = useModal();
  const {
    isOpen: isOpenEdit,
    openModal: openModalEdit,
    closeModal: closeModalEdit,
    setData: setDataEdit,
    data: editAnggotaData,
  } = useModal<AnggotaWithInstansi>();
  const {
    isOpen: isOpenConfirmDeleteAnggota,
    openModal: openModalConfirmDeleteAnggota,
    closeModal: closeModalConfirmDeleteAnggota,
    setData: setDeleteAnggotaData,
    data: deleteAnggotaData,
  } = useModal<Anggota>();

  const { data, isLoading } = api.anggota.getAnggota.useQuery({
    searchByName: searchByNameDebounce,
    searchByInstansi: searchByInstansiDebounce,
  });

  const handleOnChangeSearchByName = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchByName(ev.target.value.toUpperCase());
  };

  const handleOnChangeSearchByInstansi = (
    ev: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchByInstansi(ev.target.value);
  };

  const handleOnClickEditAnggota = (data_anggota: AnggotaWithInstansi) => {
    setDataEdit(data_anggota);
    openModalEdit();
  };

  const handleOnClickDeleteAnggota = (data_anggota: Anggota) => {
    setDeleteAnggotaData(data_anggota);
    openModalConfirmDeleteAnggota();
  };

  useEffect(() => {
    if (searchByNameDebounce && searchByInstansiDebounce) {
      void router.push(
        `/anggota?nama_anggota=${searchByNameDebounce}&nama_instansi=${searchByInstansiDebounce}`,
      );
    } else if (searchByInstansiDebounce) {
      void router.push(`/anggota?nama_instansi=${searchByInstansiDebounce}`);
    } else if (searchByNameDebounce) {
      void router.push(`/anggota?nama_anggota=${searchByNameDebounce} `);
    } else {
      void router.push("/anggota");
    }
  }, [searchByNameDebounce, searchByInstansiDebounce]);

  return (
    <Layout page="Anggota">
      <section className="flex flex-col justify-between gap-8 md:gap-4 xl:flex-row">
        <h1 className="text-3xl font-semibold text-slate-200">
          Daftar Anggota
        </h1>
        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            prefixIcon={<FiPlus />}
            onClick={openModalAdd}
          >
            Tambah Anggota
          </Button>
          <Input
            type="text"
            placeholder="Cari Anggota"
            value={searchByName}
            className="lg:max-w-xs"
            onChange={(ev) => handleOnChangeSearchByName(ev)}
          />
          <Input
            inlist="select"
            list="agency-name"
            placeholder="Cari berdasarkan Instansi"
            onChange={(ev) => handleOnChangeSearchByInstansi(ev)}
            className="md:min-w-72 lg:max-w-xs"
          />
        </div>
      </section>
      <SectionDivider />
      <section className="rounded-lg bg-slate-700 p-4 text-xs shadow-lg sm:p-8 sm:text-base">
        <Table className="w-full overflow-x-auto">
          <TableHead className="flex justify-between text-lg font-semibold">
            <TableHeadItem className="w-full min-w-12 max-w-16 py-2 text-center">
              No.
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-24 max-w-36 py-2">
              No Rekening
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-64 max-w-96 py-2">
              Nama Anggota
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-36 max-w-48 py-2">
              Instansi
            </TableHeadItem>
            <TableHeadItem className="sticky right-0 w-full min-w-24 max-w-28 bg-slate-700 px-3 py-2">
              Aksi
            </TableHeadItem>
          </TableHead>
          <TableBody className="w-full divide-y-2 divide-slate-600">
            {isLoading ? (
              <TableBodyRow className="flex w-full justify-center py-6">
                <Loader />
              </TableBodyRow>
            ) : (
              data?.anggota.map((anggota, i) => (
                <TableBodyRow
                  key={anggota.id}
                  className="flex items-center justify-between transition-all duration-100 hover:bg-slate-600"
                >
                  <TableBodyRowItem className="w-full min-w-12 max-w-16 py-2 text-left">
                    {++i}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-24 max-w-36 py-2 text-left">{`${anggota.no_rek}`}</TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-64 max-w-96 py-2 text-left">
                    {anggota.nama_anggota}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-36 max-w-48 py-2 text-left">
                    {anggota.Instansi.nama_ins}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="sticky right-0 flex w-full min-w-24 max-w-28 gap-2 bg-slate-700 px-3 py-2 lg:bg-transparent">
                    <IconButton
                      title="Edit"
                      className="bg-amber-400 hover:bg-amber-500"
                      icon={<FiEdit />}
                      onClick={() => handleOnClickEditAnggota(anggota)}
                    />
                    <IconButton
                      title="Hapus"
                      icon={<FiTrash />}
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleOnClickDeleteAnggota(anggota)}
                    />
                  </TableBodyRowItem>
                </TableBodyRow>
              ))
            )}
          </TableBody>
        </Table>
        {data?.anggota.length === 0 && (
          <p className="mt-4 w-full text-center">
            Anggota dengan nama{" "}
            <span className="font-semibold text-amber-400">
              {searchByNameDebounce}
            </span>{" "}
            tidak ditemukan
          </p>
        )}
      </section>
      <AddAnggotaModals isOpen={isOpenAdd} closeModal={closeModalAdd} />
      <EditAnggotaModal
        isOpen={isOpenEdit}
        closeModal={closeModalEdit}
        data={editAnggotaData}
      />
      <ConfirmDeleteAnggotaModal
        data_anggota={deleteAnggotaData}
        isOpen={isOpenConfirmDeleteAnggota}
        closeModal={closeModalConfirmDeleteAnggota}
      />
    </Layout>
  );
};

export default withAuth(AnggotaPage);
