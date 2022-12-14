import { ReactNode } from "react";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | ReactNode;
}

export default function DeleteButton(props: DeleteButtonProps) {
  return (
    <button
      {...props}
      className="px-4 py-2 gap-3 bg-rose-500 text-white rounded-md flex items-center hover:bg-rose-400 transition-all"
    >
      <FaTrash className="text-white" />
      {props.children}
    </button>
  );
}
