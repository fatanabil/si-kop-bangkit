import { createTRPCRouter, publicProcedure } from "../trpc";

export const pingRouter = createTRPCRouter({
  ping: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const user = await db.user.count();

    return user;
  }),
});
