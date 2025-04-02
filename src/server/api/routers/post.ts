import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "../../db/schema";
import { desc } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(1);

    return post[0] ?? null;
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        cloudinaryUrl: z.string().optional(),
        cloudinaryPublicId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.db.insert(posts).values({
        title: input.title,
        cloudinaryUrl: input.cloudinaryUrl ?? null,
        cloudinaryPublicId: input.cloudinaryPublicId ?? null,
      });

      return newPost;
    }),
});
