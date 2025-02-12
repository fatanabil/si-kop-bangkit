import { cn } from "~/utils/cn";
import IconButton from "./IconButton";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useState } from "react";
import Button from "./Button";
import { useRouter } from "next/router";

interface MonthCalendarProps {
  isOpen: boolean;
  close: () => void;
}

export const MonthsList = ({
  style = "long",
}: {
  style: "long" | "short";
}): string[] => {
  if (style === "long") {
    return [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
  } else {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
  }
};

const MonthCalendar = ({ isOpen, close }: MonthCalendarProps) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [isLoading, setIsLoading] = useState(false);
  const [activeYear, setActiveYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date(currentYear, currentMonth).toISOString(),
  );

  const months = MonthsList({ style: "short" }).map((month, i) => {
    return {
      name: month,
      datetime: new Date(activeYear, i).toISOString(),
    };
  });

  const handlePrevYear = () => {
    setIsLoading(true);
    setActiveYear((prev) => prev - 1);
    setTimeout(() => {
      setIsLoading(false);
    }, 75);
  };
  const handleNextYear = () => {
    setIsLoading(true);
    setActiveYear((prev) => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
    }, 75);
  };
  const handleSelectMonth = (datetime: string) => {
    setSelectedMonth(datetime);
    void router.push(
      `/mutasi?bulan=${activeYear}-${(new Date(datetime).getMonth() + 1).toString().padStart(2, "0")}`,
    );
  };
  const handleOnClickSelectThisMonth = () => {
    setIsLoading(true);
    setActiveYear(currentYear);
    setSelectedMonth(new Date(currentYear, currentMonth).toISOString());
    void router.push(
      `/mutasi?bulan=${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`,
    );
    setTimeout(() => {
      setIsLoading(false);
    }, 75);
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => close()}
          className={cn(
            "fixed left-0 top-0 z-0 h-full min-h-screen w-full",
            isOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        ></div>
      )}
      <div
        className={cn(
          "absolute right-0 top-[calc(100%_+_12px)] z-10 flex w-full origin-top flex-col gap-3 rounded-md bg-slate-700 p-4 shadow-md shadow-slate-800 transition-all duration-150",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-y-90 opacity-0",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <IconButton icon={<MdArrowBack />} onClick={handlePrevYear} />
          <p className="text-2xl">{activeYear.toString()}</p>
          <IconButton icon={<MdArrowForward />} onClick={handleNextYear} />
        </div>
        <div
          className={cn(
            "grid grid-cols-3 grid-rows-4 gap-1 transition-all duration-75",
            isLoading ? "opacity-0" : "opacity-100",
          )}
        >
          {months.map((mt) => (
            <Button
              key={mt.name}
              className={cn(
                "flex min-w-fit items-center justify-center rounded-md bg-slate-700 px-2 py-2 text-sm transition-all duration-150 hover:bg-slate-600 active:bg-slate-800",
                selectedMonth === mt.datetime ? "bg-slate-800" : "",
              )}
              onClick={() => handleSelectMonth(mt.datetime)}
            >
              {mt.name}
            </Button>
          ))}
        </div>
        <Button className="text-sm" onClick={handleOnClickSelectThisMonth}>
          This month
        </Button>
      </div>
    </>
  );
};

export default MonthCalendar;
