import { type Instansi } from "@prisma/client";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Button from "~/components/Button";
import Loader from "~/components/Loader";
import Toast from "~/components/Toast";
import withClientSideRender from "~/hoc/withClientSideRender";
import { api } from "~/utils/api";

interface ConfirmDeleteInstansiModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data_instansi: Instansi | undefined;
}

const ConfirmDeleteInstansiModal = ({
  isOpen,
  closeModal,
  data_instansi,
}: ConfirmDeleteInstansiModalProps) => {
  const utils = api.useUtils();

  const { mutate: deleteInstansi, isPending } =
    api.instansi.deleteInstansi.useMutation({
      onSuccess: async () => {
        await utils.instansi.getInstansi.invalidate();
        closeModal();
        toast(
          <Toast
            type="success"
            message="Sukses menghapus instansi"
            duration={5000}
          />,
        );
      },
    });

  const handleOnClickDeleteInstansi = () => {
    if (data_instansi?.id) {
      deleteInstansi({ id: data_instansi.id });
    }
  };

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
        <p>Apakah Anda yakin ingin menghapus instansi dengan nama:</p>
        <p className="text-lg font-semibold">{data_instansi?.nama_ins}</p>
        <div className="mt-14 flex justify-end gap-3">
          <Button onClick={closeModal}>Batal</Button>
          <Button
            onClick={handleOnClickDeleteInstansi}
            className="bg-red-400 hover:bg-red-500"
          >
            {isPending ? <Loader /> : "Hapus"}
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(ConfirmDeleteInstansiModal);
