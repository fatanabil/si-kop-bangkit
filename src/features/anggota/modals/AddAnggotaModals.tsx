import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "~/components/Button";
import FormErrorText from "~/components/FormErrorText";
import IconButton from "~/components/IconButton";
import Input from "~/components/Input";
import Loader from "~/components/Loader";
import Toast from "~/components/Toast";
import withClientSideRender from "~/hoc/withClientSideRender";
import { api } from "~/utils/api";
import { AddAnggotaFormScheme } from "../scheme/AddAnggotaFormSchema";

type AddAnggotaModalsPropsType = {
  isOpen: boolean;
  closeModal: () => void;
};

const AddAnggotaModals = ({
  isOpen,
  closeModal,
}: AddAnggotaModalsPropsType) => {
  const {
    formState: { errors },
    setError,
    register,
    handleSubmit,
    reset,
  } = useForm<AddAnggotaFormScheme>({
    resolver: zodResolver(AddAnggotaFormScheme),
  });

  const utils = api.useUtils();

  const { isPending, mutate: addAngotaMutate } =
    api.anggota.addAnggota.useMutation({
      onSuccess: async () => {
        await utils.anggota.getAnggota.invalidate();
        reset();
        closeModal();
        toast(
          <Toast
            message="Anggota berhasil ditambahkan"
            type="success"
            duration={5000}
          />,
        );
      },
      onError: (err) => {
        const err_data = JSON.parse(err.message) as { no_rek: string };
        setError("no_rek", { message: err_data.no_rek });
      },
    });

  const handleOnSubmitAddAnggotaForm = (values: AddAnggotaFormScheme) => {
    addAngotaMutate({
      no_rek: values.no_rek,
      nama_anggota: values.nama_anggota,
      nama_instansi: values.nama_instansi,
    });
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

  return createPortal(
    <>
      {isOpen && (
        <div className="fixed left-0 top-0 z-50 min-h-screen w-full bg-black opacity-30"></div>
      )}
      <div
        className={`fixed left-1/2 top-1/2 z-50 w-5/6 -translate-x-1/2 rounded-lg bg-slate-800 p-8 shadow-xl transition-all md:w-2/4 lg:w-2/5 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[calc(50%_+_16px)] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Tambah Anggota</h3>
          <IconButton
            onClick={closeModal}
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        <form
          method="POST"
          className="flex flex-col"
          onSubmit={handleSubmit(handleOnSubmitAddAnggotaForm)}
        >
          <div className="mt-4 flex flex-col">
            <label htmlFor="no-rek" className="mb-2 text-xl text-slate-200">
              No Rekening
            </label>
            <Input
              inputMode="numeric"
              className="w-full sm:w-full"
              isError={!!errors.no_rek}
              placeholder="No Rekening"
              {...register("no_rek", {
                required: true,
                pattern: {
                  value: /^\d+$/,
                  message: "No rekening hanya boleh angka",
                },
              })}
            />
            {errors.no_rek && <FormErrorText message={errors.no_rek.message} />}
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="nama-anggota"
              className="mb-2 text-xl text-slate-200"
            >
              Nama Anggota
            </label>
            <Input
              type="text"
              className="w-full sm:w-full"
              isError={!!errors.nama_anggota}
              placeholder="Nama Anggota"
              onInput={(ev) => {
                ev.currentTarget.value = ev.currentTarget.value.toUpperCase();
              }}
              {...register("nama_anggota", {
                required: true,
              })}
            />
            {errors.nama_anggota && (
              <FormErrorText message={errors.nama_anggota.message} />
            )}
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="nama-instansi"
              className="mb-2 text-xl text-slate-200"
            >
              Instansi
            </label>
            <Input
              type="select"
              list="agency-name"
              id="nama-instansi"
              className="w-full sm:w-full"
              placeholder="Nama Instansi"
              isError={!!errors.nama_instansi}
              {...register("nama_instansi", { required: true })}
            />
            {errors.nama_instansi && (
              <FormErrorText message={errors.nama_instansi.message} />
            )}
          </div>
          <div className="my-4"></div>
          <Button
            type="submit"
            className="self-end rounded-md bg-teal-600 px-6 py-2 text-lg text-slate-200 transition-all duration-300 hover:bg-teal-800"
          >
            {isPending ? <Loader /> : "Tambah"}
          </Button>
        </form>
      </div>
    </>,
    document.getElementById("modal-wrapper")!,
  );
};

export default withClientSideRender(AddAnggotaModals);
