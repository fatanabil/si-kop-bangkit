import { z } from "zod";
import { InstansiSchema } from "./instansi";

export const AnggotaSchema = z.object({
  id: z.number(),
  no_rek: z.string(),
  nama_anggota: z.string(),
  id_instansi: z.number(),
});

export const AnggotaWithInstansiSchema = AnggotaSchema.extend({
  Instansi: InstansiSchema,
});

export type AnggotaSchema = z.infer<typeof AnggotaSchema>;
export type AnggotaWithInstansi = z.infer<typeof AnggotaWithInstansiSchema>;
