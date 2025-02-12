import { type Instansi } from "@prisma/client";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";
import Input from "~/components/Input";
import Loader from "~/components/Loader";
import withClientSideRender from "~/hoc/withClientSideRender";
import { AddInstansiFormScheme } from "../schema/AddInstansiFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import FormErrorText from "~/components/FormErrorText";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Toast from "~/components/Toast";

interface AddInstansiModalProps {
  isOpen: boolean;
  closeModal: () => void;
  lastInstansiRecord: Instansi | undefined;
}

const AddInstansiModal = ({
  isOpen,
  closeModal,
  lastInstansiRecord,
}: AddInstansiModalProps) => {
  const lastInstansiNumberCode = parseInt(
    lastInstansiRecord?.kode_ins.replace("INS", "") ?? "",
  );
  const nextInstansiNumberCode = lastInstansiNumberCode + 1;
  const newInstansiCode = `INS${nextInstansiNumberCode.toString().length <= 3 ? "0".repeat(3 - nextInstansiNumberCode.toString().length).concat(nextInstansiNumberCode.toString()) : lastInstansiNumberCode + 1}`;

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm<AddInstansiFormScheme>({
    resolver: zodResolver(AddInstansiFormScheme),
    defaultValues: { kode_ins: newInstansiCode },
  });

  const utils = api.useUtils();

  const { mutate: addInstansi, isPending } =
    api.instansi.addInstansi.useMutation({
      onSuccess: async () => {
        await utils.instansi.getInstansi.invalidate();
        reset();
        closeModal();
        toast(
          <Toast
            type="success"
            message="Instansi berhasil ditambahkan"
            duration={5000}
          />,
        );
      },
      onError: (err) => {
        setError("kode_ins", { message: err.message });
      },
    });

  const handleOnSubmitAddInstansi = (values: AddInstansiFormScheme) => {
    addInstansi(values);
  };

  const handleOnCloseModal = () => {
    reset();
    closeModal();
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
    reset({ kode_ins: newInstansiCode });
  }, [newInstansiCode, reset]);

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
          <h3 className="text-2xl font-semibold text-white">Tambah Instansi</h3>
          <IconButton
            onClick={handleOnCloseModal}
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        <form
          method="POST"
          onSubmit={handleSubmit(handleOnSubmitAddInstansi)}
          className="flex flex-col"
        >
          <div className="mt-4 flex flex-col">
            <label htmlFor="no-rek" className="mb-2 text-xl text-slate-200">
              Kode Instansi
            </label>
            <Input
              inputMode="numeric"
              className="w-full sm:w-full"
              isError={!!errors.kode_ins}
              placeholder="Kode Instansi"
              {...register("kode_ins", { required: true })}
            />
            {errors.kode_ins && (
              <FormErrorText message={errors.kode_ins.message} />
            )}
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="nama-anggota"
              className="mb-2 text-xl text-slate-200"
            >
              Nama Instansi
            </label>
            <Input
              type="text"
              className="w-full sm:w-full"
              isError={!!errors.nama_ins}
              placeholder="Nama Instansi"
              onInput={(ev) => {
                ev.currentTarget.value = ev.currentTarget.value.toUpperCase();
              }}
              {...register("nama_ins", {
                required: true,
              })}
            />
            {errors.nama_ins && (
              <FormErrorText message={errors.nama_ins.message} />
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
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(AddInstansiModal);
