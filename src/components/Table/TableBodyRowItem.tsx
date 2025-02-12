import { ReactNode } from "react";
import { cn } from "~/utils/cn";

type TableBodyRowItemPropsType = {
  children: ReactNode;
  className?: string;
};

const TableBodyRowItem = ({
  children,
  className,
}: TableBodyRowItemPropsType) => {
  return (
    <div className={cn("w-full min-w-12 max-w-16 py-2 text-center", className)}>
      {children}
    </div>
  );
};

export default TableBodyRowItem;
