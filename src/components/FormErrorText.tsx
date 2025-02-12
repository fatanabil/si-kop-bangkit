import { type ReactNode } from "react";
import { cn } from "~/utils/cn";

type FormErrorTextPropsType = {
  className?: string;
  children?: string | ReactNode;
  message: string | undefined;
};

const FormErrorText = ({
  className,
  children,
  message,
}: FormErrorTextPropsType) => {
  return (
    <p className={cn("mt-2 text-xs text-red-400", className)}>
      * {message ?? children}
    </p>
  );
};

export default FormErrorText;
