import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import IconButton from "~/components/IconButton";
import withClientSideRender from "~/hoc/withClientSideRender";
import { EditAnggotaFormScheme } from "../scheme/EditAnggotaFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { useEffect } from "react";
import { type AnggotaWithInstansi } from "~/schemas/anggota";
import FormErrorText from "~/components/FormErrorText";
import { api } from "~/utils/api";
import Loader from "~/components/Loader";
import { toast } from "react-toastify";
import Toast from "~/components/Toast";

interface EditAnggotaModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data: AnggotaWithInstansi | undefined;
}

const EditAnggotaModal = ({
  isOpen,
  closeModal,
  data,
}: EditAnggotaModalProps) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<EditAnggotaFormScheme>({
    resolver: zodResolver(EditAnggotaFormScheme),
    defaultValues: {
      id: data?.id,
      no_rek: data?.no_rek,
      nama_anggota: data?.nama_anggota,
      nama_instansi: data?.Instansi.nama_ins,
    },
  });

  const utils = api.useUtils();

  const { isPending, mutate: updateAnggota } =
    api.anggota.editAnggota.useMutation({
      onSuccess: async () => {
        await utils.anggota.getAnggota.invalidate();
        reset();
        closeModal();
        toast(
          <Toast
            message="Anggota berhasil diperbarui"
            type="success"
            duration={5000}
          />,
        );
      },
    });

  const handleSubmitEditAnggota = (values: EditAnggotaFormScheme) => {
    updateAnggota(values);
  };

  const handleCloseModal = () => {
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
    if (data) {
      reset({
        id: data.id,
        no_rek: data.no_rek,
        nama_anggota: data.nama_anggota,
        nama_instansi: data.Instansi.nama_ins,
      });
    }
  }, [data, reset]);

  return createPortal(
    <>
      {isOpen && (
        <div className="fixed left-0 top-0 z-50 min-h-screen w-full bg-black opacity-30"></div>
      )}
      <div
        className={`fixed left-1/2 top-10 z-50 flex w-5/6 -translate-x-1/2 flex-col rounded-lg bg-slate-800 p-8 shadow-xl transition-all duration-150 md:w-2/4 lg:w-2/5 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Edit Anggota</h3>
          <IconButton
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
            onClick={handleCloseModal}
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        <form
          action=""
          onSubmit={handleSubmit(handleSubmitEditAnggota)}
          method="POST"
          className="flex flex-col"
        >
          <Input hidden {...register("id", { required: true })} />
          <div className="mt-4 flex flex-col">
            <label htmlFor="no_rek" className="mb-2 text-xl text-slate-200">
              Nomor Rekening
            </label>
            <Input
              type="text"
              className="w-full sm:w-full"
              placeholder="No Rekening"
              isError={!!errors.no_rek}
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
              htmlFor="nama_anggota"
              className="mb-2 text-xl text-slate-200"
            >
              Nama Anggota
            </label>
            <Input
              type="text"
              className="w-full sm:w-full"
              placeholder="Nama Anggota"
              onInput={(ev) => {
                ev.currentTarget.value = ev.currentTarget.value.toUpperCase();
              }}
              isError={!!errors.nama_anggota}
              {...register("nama_anggota", { required: true })}
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
          <div className="flex gap-3 self-end">
            <Button type="button" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button
              type="submit"
              className="self-end rounded-md bg-teal-600 px-6 py-2 text-lg text-slate-200 transition-all duration-300 hover:bg-teal-800"
            >
              {isPending ? <Loader /> : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(EditAnggotaModal);
