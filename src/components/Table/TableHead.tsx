import { type ReactNode } from "react";
import { cn } from "~/utils/cn";

type TableHeadPropsType = {
  children?: ReactNode | string;
  className?: string;
};

const TableHead = ({ children, className }: TableHeadPropsType) => {
  return (
    <div
      className={cn("flex justify-between text-lg font-semibold", className)}
    >
      {children}
    </div>
  );
};

export default TableHead;
