import { z } from "zod";

export const EditInstansiFormSchema = z.object({
  id: z.number(),
  prev_kode_ins: z.string().nonempty(),
  kode_ins: z
    .string()
    .nonempty({ message: "Kode Instansi tidak boleh kosong" }),
  nama_ins: z
    .string()
    .nonempty({ message: "Nama Instansi tidak boleh kosong" }),
});

export type EditInstansiFormSchema = z.infer<typeof EditInstansiFormSchema>;
