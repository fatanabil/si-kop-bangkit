import { ReactNode } from "react";
import { cn } from "~/utils/cn";

type TableBodyRowPropsType = {
  children: ReactNode;
  className?: string;
};

const TableBodyRow = ({ children, className }: TableBodyRowPropsType) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between transition-all duration-100 hover:bg-slate-600",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default TableBodyRow;
