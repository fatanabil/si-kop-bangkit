import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "~/utils/cn";

interface ButtonPropsType extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string | ReactNode;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonPropsType>(
  ({ children, prefixIcon, suffixIcon, className, ...props }, ref) => {
    if (prefixIcon) {
      return (
        <button
          ref={ref}
          className={cn(
            "flex items-center justify-center gap-3 rounded-md bg-slate-600 px-4 py-2 text-slate-200 transition-all hover:bg-slate-700 active:scale-95",
            className,
          )}
          {...props}
        >
          <i>{prefixIcon}</i>
          <span>{children}</span>
        </button>
      );
    }

    if (suffixIcon) {
      return (
        <button
          ref={ref}
          className={cn(
            "flex items-center justify-center gap-3 rounded-md bg-slate-600 px-4 py-2 text-slate-200 transition-all hover:bg-slate-700 active:scale-95",
            className,
          )}
          {...props}
        >
          <span>{children}</span>
          <i>{suffixIcon}</i>
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-3 rounded-md bg-slate-600 px-4 py-2 text-slate-200 transition-all hover:bg-slate-700 active:scale-95",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
