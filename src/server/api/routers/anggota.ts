import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddAnggotaFormScheme } from "~/features/anggota/scheme/AddAnggotaFormSchema";
import { type AnggotaWithInstansi } from "~/schemas/anggota";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { EditAnggotaFormScheme } from "~/features/anggota/scheme/EditAnggotaFormSchema";

export const anggotaRouter = createTRPCRouter({
  getAnggota: protectedProcedure
    .input(
      z.object({
        searchByName: z.string().optional(),
        searchByInstansi: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { searchByName, searchByInstansi } = input;

      let anggota: AnggotaWithInstansi[];

      if (!searchByName && !searchByInstansi) {
        anggota = await db.anggota.findMany({
          include: { Instansi: true },
          take: 50,
        });
      } else if (searchByName && searchByInstansi) {
        anggota = await db.anggota.findMany({
          include: { Instansi: true },
          where: {
            nama_anggota: { contains: searchByName.toUpperCase() },
            Instansi: {
              nama_ins: { contains: searchByInstansi.toUpperCase() },
            },
          },
        });
      } else if (searchByName) {
        anggota = await db.anggota.findMany({
          include: { Instansi: true },
          where: { nama_anggota: { contains: searchByName.toUpperCase() } },
        });
      } else if (searchByInstansi) {
        anggota = await db.anggota.findMany({
          include: { Instansi: true },
          where: {
            Instansi: {
              nama_ins: { contains: searchByInstansi.toUpperCase() },
            },
          },
        });
      } else {
        anggota = [];
      }

      return { anggota };
    }),

  addAnggota: protectedProcedure
    .input(AddAnggotaFormScheme)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { no_rek, nama_anggota, nama_instansi } = input;

      const existNoRek = await db.anggota.findMany({ where: { no_rek } });

      if (existNoRek.length > 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify({ no_rek: "No rekening sudah terdaftar!" }),
        });

      const instansi = await db.instansi.findFirst({
        where: { nama_ins: nama_instansi },
      });

      if (instansi) {
        const newAnggota = await db.anggota.create({
          data: { nama_anggota, no_rek, id_instansi: instansi.id },
        });

        return { anggota: newAnggota };
      }
    }),

  editAnggota: protectedProcedure
    .input(EditAnggotaFormScheme)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, no_rek, nama_anggota, nama_instansi } = input;

      const instansi = await db.instansi.findFirst({
        where: { nama_ins: nama_instansi },
      });

      if (instansi) {
        const editedAnggota = await db.anggota.update({
          where: { id },
          data: { no_rek, nama_anggota, id_instansi: instansi.id },
        });

        return { anggota: editedAnggota };
      }
    }),

  deleteAnggota: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const id_anggota = input.id;

      const anggota = await db.anggota.delete({ where: { id: id_anggota } });

      return { anggota };
    }),
});
