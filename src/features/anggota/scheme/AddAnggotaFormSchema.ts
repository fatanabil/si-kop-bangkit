import { z } from "zod";

export const AddAnggotaFormScheme = z.object({
  no_rek: z
    .string()
    .nonempty({ message: "No rekening tidak boleh kosong" })
    .regex(/^\d+$/, "No rekening hanya boleh angka")
    .min(10, { message: "No rekening kurang dari 10 angka!" })
    .max(10, { message: "No rekening tidak boleh lebih dari 10 angka" }),
  nama_anggota: z
    .string()
    .nonempty({ message: "Nama anggota tidak boleh kosong" }),
  nama_instansi: z
    .string()
    .nonempty({ message: "Nama instansi tidak boleh kosong" }),
});

export type AddAnggotaFormScheme = z.infer<typeof AddAnggotaFormScheme>;
