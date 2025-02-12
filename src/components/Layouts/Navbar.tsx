import ConfirmLogoutModal from "~/features/auth/modal/ConfirmLogoutModal";
import Navlink from "./Navlink";
import useModal from "~/hooks/useModal";

const Navbar = () => {
  const {
    isOpen: isOpenConfirmLogout,
    openModal: openModalConfirmLogout,
    closeModal: closeModalConfirmLogout,
  } = useModal();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full overflow-x-scroll bg-slate-700 shadow-lg sm:overflow-hidden">
        <div className="w-full">
          <div className="flex h-full w-full justify-between gap-8 px-0 sm:gap-0 sm:px-16">
            <div className="flex h-full px-0">
              <Navlink href={"/"}>Home</Navlink>
              <Navlink href={"/anggota"}>Anggota</Navlink>
              <Navlink href={"/instansi"}>Instansi</Navlink>
              <Navlink href={"/mutasi"}>Mutasi</Navlink>
              <Navlink href={"/tagihan"}>Tagihan</Navlink>
            </div>
            <button
              onClick={openModalConfirmLogout}
              className="self-center rounded-md border-2 border-red-400 px-4 py-1 text-red-400 transition-all duration-200 hover:bg-red-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <ConfirmLogoutModal
        isOpen={isOpenConfirmLogout}
        closeModal={closeModalConfirmLogout}
      />
    </>
  );
};

export default Navbar;
