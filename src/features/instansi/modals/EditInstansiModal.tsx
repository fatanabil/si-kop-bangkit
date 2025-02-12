import { zodResolver } from "@hookform/resolvers/zod";
import { type Instansi } from "@prisma/client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";
import Input from "~/components/Input";
import withClientSideRender from "~/hoc/withClientSideRender";
import { EditInstansiFormSchema } from "../schema/EditInstansiFormSchema";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import Toast from "~/components/Toast";
import FormErrorText from "~/components/FormErrorText";
import Loader from "~/components/Loader";

interface EditInstansiModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data_instansi: Instansi | undefined;
}

const EditInstansiModal = ({
  isOpen,
  closeModal,
  data_instansi,
}: EditInstansiModalProps) => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setError,
  } = useForm<EditInstansiFormSchema>({
    resolver: zodResolver(EditInstansiFormSchema),
    defaultValues: { ...data_instansi, prev_kode_ins: data_instansi?.kode_ins },
  });

  const utils = api.useUtils();

  const { mutate: updateInstansi, isPending } =
    api.instansi.updateInstansi.useMutation({
      onSuccess: async () => {
        await utils.instansi.getInstansi.invalidate();
        reset();
        closeModal();
        toast(<Toast type="success" message="Instansi berhasil diperbarui" />);
      },
      onError: (err) => {
        setError("kode_ins", { message: err.message });
      },
    });

  const handleOnSubmitUpdateInstansi = async (
    values: EditInstansiFormSchema,
  ) => {
    if (isDirty) {
      updateInstansi(values);
    } else {
      handleOnCloseModal();
    }
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
    if (data_instansi) {
      reset({ ...data_instansi, prev_kode_ins: data_instansi.kode_ins });
    }
  }, [data_instansi, reset]);

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
          <h3 className="text-2xl font-semibold text-white">Edit Instansi</h3>
          <IconButton
            onClick={handleOnCloseModal}
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        <form
          method="POST"
          onSubmit={handleSubmit(handleOnSubmitUpdateInstansi)}
          className="flex flex-col"
        >
          <Input hidden {...register("id", { required: true })} />
          <Input hidden {...register("prev_kode_ins", { required: true })} />
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
          <div className="flex gap-3 self-end">
            <Button type="button" onClick={handleOnCloseModal}>
              Batal
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-800">
              {isPending ? <Loader /> : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(EditInstansiModal);
