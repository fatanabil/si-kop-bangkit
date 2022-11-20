import { HiX } from "react-icons/hi";

interface CloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function CloseButton(props: CloseButtonProps) {
  return (
    <button {...props}>
      <HiX className="text-red-400 w-6 h-6 hover:text-red-500 transition-all" />
    </button>
  );
}
