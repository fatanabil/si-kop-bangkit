import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";
import { FiArrowRight, FiPlus, FiTrash } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { z } from "zod";
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
import { api } from "~/utils/api";
import { AddMutasiFormSchema } from "../schema/AddMutasiFormSchema";

interface AddMutasiModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

type AddMutasiValuesType = {
  data: AddMutasiFormSchema[];
};

const AddMutasiModal = ({ isOpen, closeModal }: AddMutasiModalProps) => {
  const currentMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`;

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AddMutasiValuesType>({
    resolver: zodResolver(z.object({ data: z.array(AddMutasiFormSchema) })),
    defaultValues: {
      data: [
        {
          nama_anggota: "",
          nama_instansi_dari: "",
          nama_instansi_ke: "",
          bulan: currentMonth,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "data" });

  const apiUtils = api.useUtils();
  const [mutateError, setMutateError] = useState<AddMutasiFormSchema[]>([]);
  const { mutate: addMutasiData, isPending } =
    api.mutasi.addMutasiData.useMutation({
      onError: (err) => {
        if (err.shape?.message) {
          const responseError = JSON.parse(
            err.shape.message,
          ) as AddMutasiFormSchema[];
          setMutateError(responseError);
          responseError.forEach((err) => {
            if (err.idx !== undefined && err.error) {
              setError(`data.${err.idx}.${err.error.type}`, {
                message: err.error.message,
              });
            }
          });
        }
      },
      onSuccess: async () => {
        await apiUtils.mutasi.getMutasiByMonth.invalidate();
        closeModal();
        reset();
        toast(
          <Toast
            type="success"
            message="Data mutasi berhasil ditambahkan"
            duration={5000}
          />,
        );
      },
    });

  const handleOnCloseModal = () => {
    closeModal();
  };

  const handleOnAddMutasi = (values: AddMutasiValuesType) => {
    const finalData = values.data.filter(
      (dt) =>
        dt.nama_anggota !== "" &&
        dt.nama_instansi_dari !== "" &&
        dt.nama_instansi_ke !== "",
    );

    setMutateError([]);
    addMutasiData({ data: finalData });
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
        className={`fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh_-_80px)] max-w-[calc(100%_-_32px)] -translate-x-1/2 rounded-lg bg-slate-800 p-8 shadow-xl transition-all md:w-full lg:w-full xl:w-11/12 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[calc(50%_+_16px)] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Tambah Mutasi</h3>
          <IconButton
            onClick={handleOnCloseModal}
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        {mutateError.length > 0 && (
          <div className="flex flex-col gap-1 rounded-md bg-red-500 p-3 text-white">
            {mutateError.map((err, i) => (
              <p key={i}>{err.error?.message}</p>
            ))}
          </div>
        )}
        <form
          method="POST"
          onSubmit={handleSubmit(handleOnAddMutasi)}
          className="mt-3 flex flex-col text-white"
          style={{ maxHeight: `calc(100% - 67px)` }}
        >
          <Table className="max-h-full">
            <TableHead className="sticky top-0 z-10 bg-slate-800">
              <TableHeadItem className="w-full min-w-8 max-w-10 bg-slate-800 text-center">
                No.
              </TableHeadItem>
              <TableHeadItem className="w-full min-w-80 max-w-96 bg-slate-800 px-2">
                Nama Anggota
              </TableHeadItem>
              <TableHeadItem className="w-full min-w-48 max-w-56 bg-slate-800 px-2">
                Dari Instansi
              </TableHeadItem>
              <TableHeadItem className="flex w-full min-w-8 max-w-10 items-center justify-center bg-slate-800">
                <FaArrowRight />
              </TableHeadItem>
              <TableHeadItem className="w-full min-w-48 max-w-56 bg-slate-800 px-2">
                Ke Instansi
              </TableHeadItem>
              <TableHeadItem className="w-full min-w-44 max-w-44 bg-slate-800 px-2">
                Bulan
              </TableHeadItem>
              <TableHeadItem className="sticky right-0 z-10 w-full min-w-14 max-w-14 bg-slate-800 px-2">
                Aksi
              </TableHeadItem>
            </TableHead>
            <TableBody className="z-0 flex max-h-[200px] flex-col xl:max-h-[300px]">
              {fields.map((field, i) => (
                <TableBodyRow key={field.id} className="hover:bg-transparent">
                  <TableBodyRowItem className="w-full min-w-8 max-w-10 text-center">
                    {i + 1}
                    <Input
                      className="w-full min-w-full max-w-96 px-2 text-left"
                      value={i}
                      readOnly
                      hidden
                      {...control.register(`data.${i}.idx`)}
                    />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-80 max-w-96 px-1 text-left">
                    <Controller
                      name={`data.${i}.nama_anggota`}
                      control={control}
                      defaultValue={field.nama_anggota}
                      render={({ field }) => (
                        <Input
                          className="w-full min-w-full max-w-96 px-2 text-left"
                          onInput={(ev) => {
                            ev.currentTarget.value =
                              ev.currentTarget.value.toUpperCase();
                          }}
                          isError={
                            errors.data?.[i]?.nama_anggota ? true : false
                          }
                          {...field}
                        />
                      )}
                    />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-48 max-w-56 px-1 text-left">
                    <Controller
                      name={`data.${i}.nama_instansi_dari`}
                      control={control}
                      defaultValue={field.nama_instansi_dari}
                      render={({ field }) => (
                        <Input
                          className="w-full min-w-full max-w-56 px-2 text-left"
                          type="select"
                          list="agency-name"
                          isError={
                            errors.data?.[i]?.nama_instansi_dari ? true : false
                          }
                          {...field}
                        />
                      )}
                    />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="flex w-full min-w-8 max-w-10 items-center justify-center">
                    <FiArrowRight />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-48 max-w-56 px-1 text-left">
                    <Controller
                      name={`data.${i}.nama_instansi_ke`}
                      control={control}
                      defaultValue={field.nama_instansi_ke}
                      render={({ field }) => (
                        <Input
                          className="w-full min-w-full max-w-56 px-2 text-left"
                          type="select"
                          list="agency-name"
                          isError={
                            errors.data?.[i]?.nama_instansi_dari ? true : false
                          }
                          {...field}
                        />
                      )}
                    />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="w-full min-w-44 max-w-44 px-1 text-left">
                    <Controller
                      name={`data.${i}.bulan`}
                      control={control}
                      defaultValue={field.bulan}
                      render={({ field }) => (
                        <Input
                          className="w-full min-w-full max-w-56 px-2 text-left"
                          type="month"
                          {...field}
                        />
                      )}
                    />
                  </TableBodyRowItem>
                  <TableBodyRowItem className="sticky right-0 z-0 flex w-full min-w-14 max-w-14 items-center justify-center bg-slate-800">
                    <IconButton
                      icon={<FiTrash />}
                      className="bg-red-400 hover:bg-red-500"
                      onClick={() => remove(i)}
                    />
                  </TableBodyRowItem>
                </TableBodyRow>
              ))}
            </TableBody>
          </Table>
          <IconButton
            type="button"
            className="my-3 w-fit self-end border-2 border-teal-600 bg-transparent p-3"
            icon={<FiPlus className="text-teal-600" />}
            onClick={() =>
              append({
                nama_anggota: "",
                nama_instansi_dari: "",
                nama_instansi_ke: "",
                bulan: currentMonth,
              })
            }
          />
          <Button
            type="submit"
            className="self-end rounded-md bg-teal-600 px-6 py-2 text-lg text-slate-200 transition-all duration-300 hover:bg-teal-800"
          >
            {isPending ? <Loader /> : "Tambah Mutasi"}
          </Button>
        </form>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(AddMutasiModal);
