import React from "react";
import { FaPlus } from "react-icons/fa";

interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string | React.ReactNode;
}

export default function AddButton(props: AddButtonProps) {
  return (
    <button
      className="flex gap-3 justify-center items-center px-4 py-2 text-slate-200 bg-slate-600 rounded-md hover:bg-slate-700 transition-all"
      {...props}
    >
      <FaPlus />
      <span>{props.children}</span>
    </button>
  );
}
