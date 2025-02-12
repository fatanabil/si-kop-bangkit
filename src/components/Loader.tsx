import { cn } from "~/utils/cn";

type LodaerPropsType = {
  className?: string | undefined;
};

export const Loader = ({ className, ...props }: LodaerPropsType) => {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-4 border-t-transparent",
        className,
      )}
      {...props}
    ></div>
  );
};

export default Loader;
