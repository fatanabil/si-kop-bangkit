import { z } from "zod";
import { AnggotaSchema } from "./anggota";
import { InstansiSchema } from "./instansi";

export const MutasiSchema = z.object({
  id: z.number(),
  id_anggota: z.number(),
  id_instansi_dari: z.number(),
  id_instansi_ke: z.number(),
  bulan: z.date(),
});

export const MutasiWithAnggotaInstansiSchema = MutasiSchema.extend({
  Anggota: AnggotaSchema,
  Instansi_Mutasi_id_instansi_dariToInstansi: InstansiSchema,
  Instansi_Mutasi_id_instansi_keToInstansi: InstansiSchema,
});

export type MutasiSchema = z.infer<typeof MutasiSchema>;
export type MutasiSchemaWithAnggotaInstansi = z.infer<
  typeof MutasiWithAnggotaInstansiSchema
>;
