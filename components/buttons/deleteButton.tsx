import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function DeleteButton(props: DeleteButtonProps) {
  return (
    <button {...props}>
      <FaTrash className="text-red-500 hover:text-red-400" />
    </button>
  );
}
