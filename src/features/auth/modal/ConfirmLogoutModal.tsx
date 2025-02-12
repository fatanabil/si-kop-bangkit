import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import Button from "~/components/Button";
import Loader from "~/components/Loader";
import withClientSideRender from "~/hoc/withClientSideRender";
import { api } from "~/utils/api";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ConfirmLogoutModal = ({
  isOpen,
  closeModal,
}: ConfirmLogoutModalProps) => {
  const router = useRouter();
  const {
    mutate: logout,
    isSuccess,
    isPending,
  } = api.auth.logout.useMutation();

  const handleOnClickLogout = () => {
    logout();
  };

  if (isSuccess) void router.push("/login");

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
        <p>Apakah Anda yakin ingin Logout?</p>
        <div className="mt-14 flex justify-end gap-3">
          <Button onClick={closeModal}>Batal</Button>
          <Button
            onClick={handleOnClickLogout}
            className="bg-red-400 hover:bg-red-500"
          >
            {isPending ? <Loader /> : "Logout"}
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(ConfirmLogoutModal);
