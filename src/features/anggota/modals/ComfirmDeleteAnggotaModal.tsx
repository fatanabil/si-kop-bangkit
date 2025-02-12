import { type Anggota } from "@prisma/client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Button from "~/components/Button";
import Loader from "~/components/Loader";
import Toast from "~/components/Toast";
import withClientSideRender from "~/hoc/withClientSideRender";
import { api } from "~/utils/api";

interface ConfirmDeleteAnggotaModalProps {
  data_anggota: Anggota | undefined;
  isOpen: boolean;
  closeModal: () => void;
}

const ConfirmDeleteAnggotaModal = ({
  data_anggota,
  isOpen,
  closeModal,
}: ConfirmDeleteAnggotaModalProps) => {
  const utils = api.useUtils();
  const { mutate: deleteAnggota, isPending } =
    api.anggota.deleteAnggota.useMutation({
      onSuccess: async () => {
        await utils.anggota.getAnggota.invalidate();
        closeModal();
        toast(<Toast message="Anggota berhasil dihapus" type="success" />);
      },
    });

  const handleOnClickDeleteAnggota = () => {
    if (data_anggota?.id) {
      deleteAnggota({ id: data_anggota?.id });
    }
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
        className={`fixed left-1/2 top-1/2 z-50 w-5/6 -translate-x-1/2 rounded-lg bg-slate-800 p-8 text-white shadow-xl transition-all md:w-2/4 lg:w-2/5 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[calc(50%_+_16px)] opacity-0"
        }`}
      >
        <p>Apakah Anda yakin ingin menghapus anggota dengan nama:</p>
        <p className="text-lg font-semibold">{data_anggota?.nama_anggota}</p>
        <div className="mt-14 flex justify-end gap-3">
          <Button onClick={closeModal}>Batal</Button>
          <Button
            onClick={handleOnClickDeleteAnggota}
            className="bg-red-400 hover:bg-red-500"
          >
            {isPending ? <Loader /> : "Hapus"}
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("modal-wrapper")!,
  );
};

export default withClientSideRender(ConfirmDeleteAnggotaModal);
