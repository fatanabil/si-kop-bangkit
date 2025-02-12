import { type ReactNode } from "react";
import { cn } from "~/utils/cn";

type TableBodyPropsType = {
  children?: ReactNode | string;
  className?: string;
};

const TableBody = ({ children, className }: TableBodyPropsType) => {
  return (
    <div className={cn("w-full divide-y-2 divide-slate-600", className)}>
      {children}
    </div>
  );
};

export default TableBody;
