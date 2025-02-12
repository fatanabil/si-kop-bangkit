import { z } from "zod";

export const InputTextSchema = z.object({
  no_rek: z
    .string()
    .nonempty({ message: "no rekening tidak ditemukan" })
    .min(10)
    .max(10),
  nama_anggota: z.string(),
  jumlah: z.number(),
});

export type InputTextSchema = z.infer<typeof InputTextSchema>;
