import { z } from "zod";

export const InstansiSchema = z.object({
  id: z.number(),
  nama_ins: z.string(),
  kode_ins: z.string(),
});

export type InstansiSchema = z.infer<typeof InstansiSchema>;
