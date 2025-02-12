import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

interface InputPropsType extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputPropsType>(
  ({ className, isError, ...props }: InputPropsType, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md bg-slate-600 px-4 py-2 text-slate-200 shadow-md shadow-slate-800 outline-none transition-all focus:ring-2 focus:ring-slate-500",
          className,
          isError ? "ring-2 ring-red-400 focus:ring-red-400" : "",
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export default Input;
