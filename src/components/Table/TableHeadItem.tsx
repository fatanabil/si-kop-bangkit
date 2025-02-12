import { ReactNode } from "react";
import { cn } from "~/utils/cn";

type TableHeadItemPropsType = {
  children?: ReactNode;
  className?: string;
};

const TableHeadItem = ({ children, className }: TableHeadItemPropsType) => {
  return (
    <div className={cn("w-full min-w-12 max-w-16 py-2", className)}>
      {children}
    </div>
  );
};

export default TableHeadItem;
