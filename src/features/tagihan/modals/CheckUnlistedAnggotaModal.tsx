import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";
import Input from "~/components/Input";
import Loader from "~/components/Loader";
import Table from "~/components/Table/Table";
import TableBody from "~/components/Table/TableBody";
import TableBodyRow from "~/components/Table/TableBodyRow";
import TableBodyRowItem from "~/components/Table/TableBodyRowItem";
import TableHead from "~/components/Table/TableHead";
import TableHeadItem from "~/components/Table/TableHeadItem";
import Toast from "~/components/Toast";
import withClientSideRender from "~/hoc/withClientSideRender";
import { type UnlistedAnggotaSchema } from "~/schemas/tagihan";
import { api } from "~/utils/api";
import formatCurrency from "~/utils/formatCurrency";
import { type UnlistedAnggotaFormSchema } from "../schema/UnlistedAnggotaFormSchema";

interface CheckUnlistedAnggotaModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data: UnlistedAnggotaSchema[] | undefined;
  reCheckTagihanData: () => void;
}

const CheckUnlistedAnggotaModal = ({
  isOpen,
  closeModal,
  data,
  reCheckTagihanData,
}: CheckUnlistedAnggotaModalProps) => {
  const total = formatCurrency(
    (data ?? []).reduce((acc, curr) => acc + curr.jumlah, 0),
  );

  const [onEdit, setOnEdit] = useState(false);

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm<{ data: UnlistedAnggotaFormSchema[] }>();
  const { fields, remove } = useFieldArray({ control, name: "data" });

  const { mutate: addUnlistedAnggota, isPending } =
    api.tagihan.addUnlistedAnggota.useMutation({
      onSuccess: (result) => {
        toast(
          <Toast type="success" message="Sukses menambahkan anggota baru" />,
        );
        reCheckTagihanData();
        handleOnCloseModal();
      },
    });

  const handleOnCloseModal = () => {
    closeModal();
  };

  const handleOnClickEdit = () => {
    if (onEdit) {
      reset({
        data: data?.map((dt) => {
          return { ...dt, nama_instansi: "", idx: 0 };
        }),
      });
      setOnEdit(false);
    } else {
      setOnEdit(true);
    }
  };

  const handleOnSubmitUnlistedAnggota = (values: {
    data: UnlistedAnggotaFormSchema[];
  }) => {
    addUnlistedAnggota(values.data);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      setValue(
        "data",
        data.map((dt) => {
          return { ...dt, nama_instansi: "", idx: 0 };
        }),
      );
    }
  }, [data]);

  useEffect(() => {
    fields.forEach((_, index) => {
      setValue(`data.${index}.idx`, index);
    });
  }, [fields, setValue]);

  return createPortal(
    <>
      {isOpen && (
        <div className="fixed left-0 top-0 z-50 min-h-screen w-full bg-black opacity-30"></div>
      )}
      <div
        className={`fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh_-_80px)] w-full max-w-[calc(100%_-_32px)] -translate-x-1/2 rounded-lg bg-slate-800 p-8 text-white shadow-xl transition-all md:w-full lg:w-full xl:w-5/6 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[calc(50%_+_16px)] opacity-0"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-white">Anggota Baru</h3>
            <p className="text-md text-amber-400">Total: {total}</p>
          </div>
          <IconButton
            onClick={handleOnCloseModal}
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        <section className="flex w-full flex-col">
          <form
            method="POST"
            className="flex w-full flex-col text-white"
            onSubmit={handleSubmit(handleOnSubmitUnlistedAnggota)}
          >
            <Table className="h-full">
              <TableHead className="sticky top-0 bg-slate-800">
                <TableHeadItem className="w-full min-w-12 max-w-16 bg-slate-800 text-center">
                  No.
                </TableHeadItem>
                <TableHeadItem className="w-full min-w-36 max-w-48 bg-slate-800">
                  No Rekening
                </TableHeadItem>
                <TableHeadItem className="w-full min-w-72 max-w-80 bg-slate-800">
                  Nama Anggota
                </TableHeadItem>
                <TableHeadItem className="w-full min-w-56 max-w-64 bg-slate-800">
                  Instansi
                </TableHeadItem>
                <TableHeadItem className="w-full min-w-40 max-w-52 bg-slate-800">
                  Jumlah
                </TableHeadItem>
                {onEdit && (
                  <TableHeadItem className="w-full min-w-16 max-w-24">
                    Aksi
                  </TableHeadItem>
                )}
              </TableHead>
              <TableBody className="max-h-[300px] xl:max-h-[400px]">
                {fields.length === 0 ? (
                  <TableBodyRow>
                    <div className="w-full py-3 text-center text-slate-400">
                      Tidak ada anggota baru
                    </div>
                  </TableBodyRow>
                ) : (
                  fields?.map((field, i) => (
                    <TableBodyRow key={field.id}>
                      <TableBodyRowItem className="w-full min-w-12 max-w-16 text-center">
                        {i + 1}
                        <Input
                          value={i}
                          hidden
                          {...control.register(`data.${i}.idx`)}
                        />
                      </TableBodyRowItem>
                      <TableBodyRowItem className="w-full min-w-36 max-w-48 text-left">
                        {field.no_rek}
                        <Controller
                          name={`data.${i}.no_rek`}
                          control={control}
                          defaultValue={field.no_rek}
                          render={({ field }) => <Input hidden {...field} />}
                        />
                      </TableBodyRowItem>
                      <TableBodyRowItem className="w-full min-w-72 max-w-80 text-left">
                        {field.nama_anggota}
                        <Controller
                          name={`data.${i}.nama_anggota`}
                          control={control}
                          defaultValue={field.nama_anggota}
                          render={({ field }) => <Input hidden {...field} />}
                        />
                      </TableBodyRowItem>
                      <TableBodyRowItem className="w-full min-w-56 max-w-64 pr-4 text-left">
                        {!onEdit ? (
                          "-"
                        ) : (
                          <Controller
                            name={`data.${i}.nama_instansi`}
                            control={control}
                            defaultValue={field.nama_instansi}
                            render={({ field }) => (
                              <Input
                                type="select"
                                list="agency-name"
                                {...field}
                              />
                            )}
                          />
                        )}
                      </TableBodyRowItem>
                      <TableBodyRowItem className="w-full min-w-40 max-w-52 text-left">
                        {formatCurrency(field.jumlah)}
                      </TableBodyRowItem>
                      {onEdit && (
                        <TableBodyRowItem className="w-full min-w-16 max-w-24">
                          <IconButton
                            icon={<FiTrash onClick={() => remove(i)} />}
                            className="bg-red-400 hover:bg-red-500"
                          />
                        </TableBodyRowItem>
                      )}
                    </TableBodyRow>
                  ))
                )}
              </TableBody>
            </Table>
            {fields.length > 0 && (
              <div className="mt-4 flex gap-4 self-end">
                <Button type="button" onClick={handleOnClickEdit}>
                  {!onEdit ? "Tambah semua anggota baru" : "Batal"}
                </Button>
                {onEdit && (
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-800"
                  >
                    {isPending ? <Loader /> : "Simpan"}
                  </Button>
                )}
              </div>
            )}
          </form>
        </section>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(CheckUnlistedAnggotaModal);
