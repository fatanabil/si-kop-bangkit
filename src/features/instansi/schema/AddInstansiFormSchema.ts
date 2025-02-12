import { z } from "zod";

export const AddInstansiFormScheme = z.object({
  kode_ins: z.string().nonempty("Kode instansi tidak boleh kossong"),
  nama_ins: z.string().nonempty("Nama instansi tidak boleh kosong"),
});

export type AddInstansiFormScheme = z.infer<typeof AddInstansiFormScheme>;
