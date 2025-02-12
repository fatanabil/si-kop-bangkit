import { cn } from "~/utils/cn";

interface BadgeProps {
  value: string | number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const Badge = ({ value, position = "top-right" }: BadgeProps) => {
  const badgePosition = {
    "top-right": "right-0 top-0 -translate-y-1/2 translate-x-1/2",
    "top-left": "left-0 top-0 -translate-y-1/2 -translate-x-1/2",
    "bottom-right": "right-0 bottom-0 translate-y-1/2 translate-x-1/2",
    "bottom-left": "left-0 bottom-0 translate-y-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={cn(
        "absolute flex aspect-square items-center justify-center rounded-full bg-sky-500 px-2 text-sm",
        badgePosition[position],
      )}
    >
      {value}
    </div>
  );
};

export default Badge;
