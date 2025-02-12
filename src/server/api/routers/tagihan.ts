import { z } from "zod";
import { InputTextSchema } from "~/features/tagihan/schema/InputTextSchema";
import { type AnggotaWithInstansi } from "~/schemas/anggota";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { UnlistedAnggotaFormSchema } from "~/features/tagihan/schema/UnlistedAnggotaFormSchema";
import { TRPCError } from "@trpc/server";

export const tagihanRouter = createTRPCRouter({
  checkInputText: publicProcedure
    .input(z.array(InputTextSchema))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const data: InputTextSchema[] = input;
      const noRekArray = data.map((dt) => dt.no_rek);

      const dataAnggota = await db.anggota.findMany({
        where: { no_rek: { in: noRekArray } },
        include: { Instansi: true },
      });

      const mapDataAnggota = new Map<string, AnggotaWithInstansi>();
      for (const item of dataAnggota) {
        mapDataAnggota.set(item.no_rek, item);
      }

      const mergedData = data.map((dt) => {
        const matchData = mapDataAnggota.get(dt.no_rek);
        if (matchData) {
          return { ...matchData, jumlah: dt.jumlah };
        }
        return { ...dt, id: undefined };
      });

      const listedAnggota = mergedData.filter((dt) => dt.id !== undefined);
      const unlistedAnggota = mergedData.filter((dt) => dt.id === undefined);

      return {
        data: {
          listed_anggota: listedAnggota,
          unlisted_anggota: unlistedAnggota,
        },
      };
    }),

  addUnlistedAnggota: protectedProcedure
    .input(z.array(UnlistedAnggotaFormSchema))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const data = input;

      const checkNoRek = data.map(async (dt) => {
        const isListed = await db.anggota.findFirst({
          where: { no_rek: dt.no_rek },
          include: { Instansi: true },
        });
        const idInstansi = await db.instansi.findFirst({
          where: { nama_ins: dt.nama_instansi },
        });

        if (isListed) {
          return {
            ...dt,
            id_instansi: isListed.Instansi.id,
            error: {
              type: "nama_anggota",
              message: `${dt.nama_anggota} sudah terdaftar`,
            },
          };
        }

        return { ...dt, id_instansi: idInstansi!.id };
      });

      return Promise.all(checkNoRek)
        .then(async (result) => {
          const onError = result.filter((dt) => Object.hasOwn(dt, "error"));

          if (onError.length > 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: JSON.stringify(onError),
            });
          }

          const insertData = result.map((dt) => {
            return {
              no_rek: dt.no_rek,
              nama_anggota: dt.nama_anggota,
              id_instansi: dt.id_instansi,
            };
          });
          await db.anggota.createMany({ data: insertData });

          return { success: true };
        })
        .catch((error) => {
          if (error instanceof TRPCError) {
            throw new TRPCError({ ...error });
          }
        });
    }),
});
