import { cn } from "~/utils/cn";

type SectionDividerPropsType = {
  className?: string;
};

const SectionDivider = ({ className }: SectionDividerPropsType) => {
  return (
    <hr className={cn("my-8 border-2 border-slate-600 bg-none", className)} />
  );
};

export default SectionDivider;
