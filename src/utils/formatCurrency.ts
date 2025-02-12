type optionsFormatCurrency = {
  locales?: Intl.LocalesArgument;
  options?: Intl.NumberFormatOptions;
};

const formatCurrency = (
  value: number,
  {
    locales = "id-ID",
    options = {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  }: optionsFormatCurrency = {},
): string => {
  const num = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(num)) return "-";

  return new Intl.NumberFormat(locales, { ...options }).format(value);
};

export default formatCurrency;
