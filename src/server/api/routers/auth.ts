import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { z } from "zod";
import { createToken } from "~/utils/jwt";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { db } = ctx;
        const { username, password } = input;

        const user = await db.user.findUnique({ where: { username } });

        if (!user) throw new Error("Invalid credentials!");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) throw new Error("Invalid credentials!");

        const token = createToken({ id: user.id, username: user.username });

        const tokenCookie = serialize("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60,
          path: "/",
        });

        ctx.res.setHeader("Set-Cookie", [tokenCookie]);

        return { success: true };
      } catch (error) {
        console.log(error);
      }
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const deleteTokenCookie = serialize("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    });

    ctx.res.setHeader("Set-Cookie", [deleteTokenCookie]);
    return { success: true };
  }),

  check: protectedProcedure.mutation(({ ctx }) => {
    return ctx.user;
  }),
});
