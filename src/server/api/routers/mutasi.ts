import { tuple, z } from "zod";
import { AddMutasiFormSchema } from "~/features/mutasi/schema/AddMutasiFormSchema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const mutasiRouter = createTRPCRouter({
  getMutasiByMonth: protectedProcedure
    .input(z.string().nonempty({ message: "Input tidak boleh kosong" }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const bulan = new Date(input);

      const mutasi_data = await db.mutasi.findMany({
        where: { bulan },
        include: {
          Anggota: true,
          Instansi_Mutasi_id_instansi_dariToInstansi: true,
          Instansi_Mutasi_id_instansi_keToInstansi: true,
        },
      });

      return mutasi_data;
    }),

  addMutasiData: protectedProcedure
    .input(z.object({ data: z.array(AddMutasiFormSchema) }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { data } = input;

      const checkData = data.map(async (dt) => {
        if (isNaN(Number(dt.nama_anggota))) {
          const checkDupAnggota = await db.anggota.findMany({
            where: {
              nama_anggota: { contains: dt.nama_anggota },
              Instansi: { nama_ins: dt.nama_instansi_dari },
            },
            include: { Instansi: true },
          });
          const idInstansiKe = await db.instansi.findFirst({
            where: { nama_ins: dt.nama_instansi_ke },
          });

          if (dt.nama_instansi_dari === dt.nama_instansi_ke) {
            return {
              ...dt,
              error: {
                message: `${dt.nama_anggota}, nama Instansi sama!`,
                type: "nama_instansi_dari",
              },
            };
          }

          if (checkDupAnggota.length > 1) {
            return {
              ...dt,
              error: {
                message: `${dt.nama_anggota} duplikat, mohon input nama lebih spesifik atau gunakan no rekening!`,
                type: "nama_anggota",
              },
            };
          } else if (checkDupAnggota.length === 0) {
            return {
              ...dt,
              error: {
                message: `${dt.nama_anggota} tidak terdaftar di ${dt.nama_instansi_dari}`,
                type: "nama_anggota",
              },
            };
          }

          return {
            ...dt,
            Anggota: checkDupAnggota[0],
            id_instansi_dari: checkDupAnggota[0]?.Instansi.id,
            id_instansi_ke: idInstansiKe?.id,
          };
        } else {
          const anggotaWithNorek = await db.anggota.findFirst({
            where: { no_rek: dt.nama_anggota },
            include: { Instansi: true },
          });
          const idInstansiKe = await db.instansi.findFirst({
            where: { nama_ins: dt.nama_instansi_ke },
          });

          return {
            ...dt,
            Anggota: anggotaWithNorek,
            id_instansi_dari: anggotaWithNorek?.Instansi.id,
            id_instansi_ke: idInstansiKe?.id,
          };
        }
      });

      return Promise.all(checkData)
        .then(async (result) => {
          const isError = result.filter((dt) => Object.hasOwn(dt, "error"));

          if (isError.length > 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: JSON.stringify(isError),
            });
          } else {
            const processMutasi = result.map(async (dt) => {
              if (dt.Anggota && dt.id_instansi_dari && dt.id_instansi_ke) {
                try {
                  await db.mutasi.create({
                    data: {
                      id_anggota: dt.Anggota?.id,
                      id_instansi_dari: dt.id_instansi_dari,
                      id_instansi_ke: dt.id_instansi_ke,
                      bulan: new Date(dt.bulan),
                    },
                  });
                  await db.anggota.update({
                    where: { id: dt.Anggota.id },
                    data: { id_instansi: dt.id_instansi_ke },
                  });

                  return { status: "success" };
                } catch (err) {
                  throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Insert mutasi fail",
                  });
                }
              }
            });

            return Promise.all(processMutasi)
              .then(() => {
                return { status: "success" };
              })
              .catch((err) => {
                if (err instanceof TRPCError) {
                  throw new TRPCError({ code: err.code, message: err.message });
                }
              });
          }
        })
        .catch((err) => {
          if (err instanceof TRPCError) {
            throw new TRPCError({ code: err.code, message: err.message });
          }
        });
    }),
});
