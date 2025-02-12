import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { anggotaRouter } from "./routers/anggota";
import { instansiRouter } from "./routers/instansi";
import { mutasiRouter } from "./routers/mutasi";
import { pingRouter } from "./routers/ping";
import { tagihanRouter } from "./routers/tagihan";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ping: pingRouter,
  auth: authRouter,
  anggota: anggotaRouter,
  instansi: instansiRouter,
  mutasi: mutasiRouter,
  tagihan: tagihanRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
