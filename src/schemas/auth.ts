import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1, { message: "Username wajib diisi!" });
export const passwordSchema = z
  .string()
  .min(1, { message: "Password wajib diisi!" });
