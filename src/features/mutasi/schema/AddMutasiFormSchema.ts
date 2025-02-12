import { z } from "zod";
import { AnggotaSchema } from "~/schemas/anggota";

export const AddMutasiFormSchema = z.object({
  idx: z.number().optional(),
  nama_anggota: z.string(),
  nama_instansi_dari: z
    .string()
    .nonempty({ message: "Instansi dari tidak boleh kosong" }),
  nama_instansi_ke: z
    .string()
    .nonempty({ message: "Instansi ke tidak boleh kosong" }),
  bulan: z.string(),
  error: z
    .object({
      message: z.string(),
      type: z.enum(["nama_anggota", "nama_instansi_dari"]),
    })
    .optional(),
  Anggota: AnggotaSchema.optional(),
  id_instansi_dari: z.number().optional(),
  id_instansi_ke: z.number().optional(),
});

export type AddMutasiFormSchema = z.infer<typeof AddMutasiFormSchema>;
