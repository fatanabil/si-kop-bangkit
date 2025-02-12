import { type NextApiResponse } from "next";
import { serialize, type SerializeOptions } from "cookie";

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: SerializeOptions = {},
) => {
  const stringVal = typeof value === "object" ? JSON.stringify(value) : value;
  res.setHeader("Set-Cookie", serialize(name, stringVal, options));
};

export const clearCookie = (res: NextApiResponse, name: string) => {
  res.setHeader("Set-Cookie", serialize(name, "", { maxAge: -1, path: "/" }));
};
