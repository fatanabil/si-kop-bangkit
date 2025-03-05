import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";
import Loader from "~/components/Loader";
import Toast from "~/components/Toast";
import withClientSideRender from "~/hoc/withClientSideRender";
import {
  type ListedAnggotaSchema,
  type UnlistedAnggotaSchema,
} from "~/schemas/tagihan";
import { api } from "~/utils/api";
import parseJumlah from "~/utils/parseJumlah";

interface InputTextTagihanModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setListedAnggotaValue: (
    value:
      | ListedAnggotaSchema[]
      | ((val: ListedAnggotaSchema[]) => ListedAnggotaSchema[]),
  ) => void;
  setUnlistedAnggotaValue: (
    value:
      | UnlistedAnggotaSchema[]
      | ((val: UnlistedAnggotaSchema[]) => UnlistedAnggotaSchema[]),
  ) => void;
}

const InputTextTagihanModal = ({
  isOpen,
  closeModal,
  setListedAnggotaValue,
  setUnlistedAnggotaValue,
}: InputTextTagihanModalProps) => {
  const [inputText, setInputText] = useState("");

  const { mutate: uploadInputText, isPending } =
    api.tagihan.checkInputText.useMutation({
      onSuccess: (result) => {
        const { listed_anggota, unlisted_anggota } = result.data;
        setListedAnggotaValue(listed_anggota);
        setUnlistedAnggotaValue(unlisted_anggota);
        closeModal();
        toast(
          <Toast
            type="success"
            message="Input text berhasil"
            duration={5000}
          />,
        );
        setInputText("");
      },
    });

  const handleOnCloseModal = () => {
    closeModal();
  };

  const handleOnClickSend = () => {
    const rows = inputText.split("\n").filter(Boolean);
    const parsedRow = rows.map((row) => {
      const rowItem = row.split("\t").map((item) => item.trim()) as [
        "",
        "",
        "",
      ];
      const finalRowItem = {
        no_rek: rowItem[0].padStart(10, "0"),
        nama_anggota: rowItem[1],
        jumlah: parseJumlah(rowItem[2]),
      };
      return finalRowItem;
    });
    uploadInputText(parsedRow);
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
        className={`fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh_-_80px)] w-full max-w-[calc(100%_-_32px)] -translate-x-1/2 rounded-lg bg-slate-800 p-8 shadow-xl transition-all md:w-full lg:w-full xl:w-4/6 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[calc(50%_+_16px)] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-white">Input Text</h3>
            <p className="text-md text-amber-400">
              Format input: {`no_rek[tab]nama_anggota[tab]jumlah`}
            </p>
          </div>
          <IconButton
            onClick={handleOnCloseModal}
            icon={<MdClose />}
            className="bg-red-400 hover:bg-red-500"
          />
        </div>
        <hr className="my-4 rounded-full border-2 border-slate-600 bg-slate-600" />
        <div>
          <textarea
            name="input-text"
            id="input-text"
            className="w-full rounded-md bg-slate-600 p-3 text-white outline-none transition-all focus:ring-2 focus:ring-slate-500"
            rows={10}
            onChange={(ev) => setInputText(ev.target.value)}
            value={inputText}
          ></textarea>
          <Button
            onClick={handleOnClickSend}
            className="mt-2 w-full bg-teal-600 transition-all duration-300 hover:bg-teal-800 active:scale-x-95"
          >
            {isPending ? <Loader /> : "Kirim"}
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("modal-wrapper") as Element,
  );
};

export default withClientSideRender(InputTextTagihanModal);
