import { useEffect, useState } from "react";
import { cn } from "~/utils/cn";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

const Toast = ({ message, type, duration = 3000 }: ToastProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);

    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <div
      className={cn(
        "h-full w-full overflow-clip rounded-lg bg-black p-4 text-lg text-white shadow-lg shadow-slate-700 transition-all duration-500 ease-in-out lg:right-16",
        isOpen ? "translate-x-0" : "translate-x-[500px]",
        type === "success" ? "bg-emerald-500" : "",
        type === "error" ? "bg-rose-500" : "",
        type === "info" ? "bg-cyan-500" : "",
      )}
    >
      {message}
      <i
        style={{ transitionDuration: `${duration - 1000}ms` }}
        className={cn(
          "absolute bottom-0 left-0 h-[3px] origin-left bg-white transition-all delay-100 ease-linear",
          isOpen ? "w-full" : "w-0",
        )}
      ></i>
    </div>
  );
};

export default Toast;
