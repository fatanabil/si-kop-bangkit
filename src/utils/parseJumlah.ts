const parseJumlah = (value: string): number => {
  const hasComma = value.includes(",");

  return (
    parseInt(
      value.replace(/[.,]/g, (match) => {
        return match === "." && hasComma ? "" : match === "," ? "." : "";
      }),
      10,
    ) || 0
  );
};

export default parseJumlah;
