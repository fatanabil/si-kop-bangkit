import { useRouter } from "next/router";
import { type ChangeEvent, useEffect, useState } from "react";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Layout from "~/components/Layouts/Layout";
import Loader from "~/components/Loader";
import MonthCalendar from "~/components/MonthCalendar";
import SectionDivider from "~/components/SectionDivider";
import Table from "~/components/Table/Table";
import TableBody from "~/components/Table/TableBody";
import TableBodyRow from "~/components/Table/TableBodyRow";
import TableBodyRowItem from "~/components/Table/TableBodyRowItem";
import TableHead from "~/components/Table/TableHead";
import TableHeadItem from "~/components/Table/TableHeadItem";
import useModal from "~/hooks/useModal";
import { api } from "~/utils/api";
import AddMutasiModal from "../modals/AddMutasiModal";

const MutasiPage = () => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(
    () =>
      (router.query.bulan as string) ??
      `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`,
  );
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);

  const { data, isPending } =
    api.mutasi.getMutasiByMonth.useQuery(currentMonth);

  const addMutasiModal = useModal();

  const openCalendar = () => setIsOpenCalendar(true);
  const closeCalendar = () => setIsOpenCalendar(false);

  const handleOnChangeCurrentMonth = (ev: ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(ev.target.value);
  };

  useEffect(() => {
    if (router.query.bulan) {
      setCurrentMonth(router.query.bulan as string);
    }
  }, [router.query.bulan]);

  return (
    <Layout>
      <section className="flex flex-col justify-between gap-8 md:gap-4 lg:flex-row">
        <h1 className="text-3xl font-semibold text-slate-200">Daftar Mutasi</h1>
        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            prefixIcon={<FiPlus />}
            onClick={addMutasiModal.openModal}
          >
            Tambah Mutasi
          </Button>
          <div className="relative w-fit self-end">
            <Input
              type="month"
              className="w-full sm:w-72"
              placeholder="Cari Mutasi"
              value={currentMonth}
              onChange={(ev) => handleOnChangeCurrentMonth(ev)}
              onFocus={openCalendar}
            />
            <MonthCalendar isOpen={isOpenCalendar} close={closeCalendar} />
          </div>
        </div>
      </section>
      <SectionDivider />
      <section className="rounded-lg bg-slate-700 p-4 text-xs shadow-lg sm:p-8 sm:text-base">
        <Table>
          <TableHead>
            <TableHeadItem className="w-full min-w-12 max-w-16 py-2 text-center">
              No.
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-64 max-w-96 py-2 text-left">
              Nama Anggota
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-48 max-w-56 py-2 text-left">
              Dari Instansi
            </TableHeadItem>
            <TableHeadItem className="flex items-center">
              <FiArrowRight />
            </TableHeadItem>
            <TableHeadItem className="w-full min-w-48 max-w-56 py-2 text-left">
              Ke Instansi
            </TableHeadItem>
          </TableHead>
          <TableBody>
            {isPending ? (
              <TableBodyRow className="flex w-full justify-center py-6">
                <Loader />
              </TableBodyRow>
            ) : (
              data?.map((mutasi, i) => (
                <TableBodyRow key={mutasi.id}>
                  <TableBodyRowItem className="w-full min-w-12 max-w-16 py-2">
                    {++i}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-64 max-w-96 py-2 text-left">
                    {mutasi.Anggota.nama_anggota}
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-48 max-w-56 py-2 text-left">
                    {mutasi.Instansi_Mutasi_id_instansi_dariToInstansi.nama_ins}
                  </TableBodyRowItem>
                  <TableBodyRowItem>
                    <FiArrowRight />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-48 max-w-56 py-2 text-left">
                    {mutasi.Instansi_Mutasi_id_instansi_keToInstansi.nama_ins}
                  </TableBodyRowItem>
                </TableBodyRow>
              ))
            )}
          </TableBody>
        </Table>
        {data?.length === 0 && (
          <p className="mt-4 w-full text-center">
            <span>Data mutasi pada bulan </span>
            <span className="font-semibold text-amber-400">
              {new Date(currentMonth).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
              })}
            </span>
            <span> tidak ditemukan</span>
          </p>
        )}
      </section>
      <AddMutasiModal {...addMutasiModal} />
    </Layout>
  );
};

export default MutasiPage;
