import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "~/utils/cn";

interface IconButtonPropsType extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  className?: string;
}

const IconButton = ({ icon, className, ...props }: IconButtonPropsType) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-3 rounded-md bg-slate-600 px-2 py-2 text-slate-200 transition-all hover:bg-slate-700 active:scale-95",
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
