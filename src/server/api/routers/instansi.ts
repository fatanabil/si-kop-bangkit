import { type Instansi } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddInstansiFormScheme } from "~/features/instansi/schema/AddInstansiFormSchema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const instansiRouter = createTRPCRouter({
  getAgencyList: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const instansi = await db.instansi.findMany();

    return { instansi };
  }),

  getInstansi: protectedProcedure
    .input(z.object({ searchByName: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { searchByName } = input;

      let instansi: Instansi[];

      if (searchByName) {
        instansi = await db.instansi.findMany({
          where: { nama_ins: { contains: searchByName.toUpperCase() } },
        });
      } else {
        instansi = await db.instansi.findMany({
          orderBy: { kode_ins: "asc" },
        });
      }

      return { instansi };
    }),

  addInstansi: protectedProcedure
    .input(AddInstansiFormScheme)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { kode_ins, nama_ins } = input;

      const existKodeIns = await db.instansi.findFirst({ where: { kode_ins } });

      if (existKodeIns) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Instansi dengan kode ${existKodeIns.kode_ins} sudah ada, mohon gunakan kode yang lain`,
        });
      }

      const newInstansi = await db.instansi.create({
        data: { kode_ins, nama_ins },
      });

      return { instansi: newInstansi };
    }),

  updateInstansi: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        prev_kode_ins: z.string(),
        kode_ins: z.string(),
        nama_ins: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { id, kode_ins, nama_ins, prev_kode_ins } = input;

      let updatedInstansi;

      if (prev_kode_ins !== kode_ins) {
        const existKodeIns = await db.instansi.findFirst({
          where: { kode_ins },
        });

        if (existKodeIns) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Instansi dengan kode ${existKodeIns.kode_ins} sudah ada, mohon gunakan kode yang lain`,
          });
        }

        updatedInstansi = await db.instansi.update({
          where: { id },
          data: { id, kode_ins, nama_ins },
        });
      } else {
        updatedInstansi = await db.instansi.update({
          where: { id },
          data: { id, kode_ins, nama_ins },
        });
      }

      return { instansi: updatedInstansi };
    }),

  deleteInstansi: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { id } = input;

      const deletedInstansi = await db.instansi.delete({ where: { id } });

      return { instansi: deletedInstansi };
    }),
});
