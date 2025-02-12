import { z } from "zod";
import { AnggotaWithInstansiSchema } from "./anggota";
import { InputTextSchema } from "~/features/tagihan/schema/InputTextSchema";

export const ListedAnggotaSchema = AnggotaWithInstansiSchema.extend({
  jumlah: z.number(),
});
export const UnlistedAnggotaSchema = InputTextSchema;

export type ListedAnggotaSchema = z.infer<typeof ListedAnggotaSchema>;
export type UnlistedAnggotaSchema = z.infer<typeof UnlistedAnggotaSchema>;
