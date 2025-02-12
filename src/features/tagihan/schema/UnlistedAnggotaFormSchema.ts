import { TypeOf, z } from "zod";

export const UnlistedAnggotaFormSchema = z.object({
  idx: z.number(),
  no_rek: z.string().nonempty({ message: "No rekening tidak boleh kosong" }),
  nama_anggota: z
    .string()
    .nonempty({ message: "Nama anggota tidak boleh kosong" }),
  nama_instansi: z.string(),
  jumlah: z.number(),
});

export type UnlistedAnggotaFormSchema = z.infer<
  typeof UnlistedAnggotaFormSchema
>;
