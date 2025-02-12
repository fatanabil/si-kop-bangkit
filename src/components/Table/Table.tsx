import { ReactNode } from "react";
import { cn } from "~/utils/cn";

type TablePropsType = {
  children?: ReactNode;
  className?: string;
};

const Table = ({ children, className }: TablePropsType) => {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>{children}</div>
  );
};

export default Table;
