import { z } from "zod";
import { t } from "../config/tRCP";
import { TRPCError } from "@trpc/server";
import { createRatingSchema } from "../schemas/rating.schemas";

export const postRatingRouter = t.router({
  create: t.procedure
    .input(createRatingSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 1️⃣ Crear el nuevo rating en la DB
        await ctx.prisma.rating.create({
          data: {
            rating: input.rating,
            postId: input.postId,
          },
        });

        // 2️⃣ Buscar TODOS los ratings del post (incluyendo el recién creado)
        const ratings = await ctx.prisma.rating.findMany({
          where: { postId: input.postId },
          select: { rating: true },
        });

        // 3️⃣ Calcular el nuevo promedio
        const avgRating =
          ratings.reduce((sum: any, r: { rating: any }) => sum + r.rating, 0) /
          ratings.length;

        // 4️⃣ Guardar el avgRating en el Post
        await ctx.prisma.post.update({
          where: { id: input.postId },
          data: { avgRating: avgRating },
        });

        return { success: true, avgRating };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al publicar el rating.",
          cause: error,
        });
      }
    }),

  getRatingByPost: t.procedure
    .input(z.object({ postId: z.number() })) // Recibe el postId
    .query(async ({ input, ctx }) => {
      try {
        console.log(
          "Recibiendo postId:",
          input.postId,
          "Tipo:",
          typeof input.postId
        );
        // Busca todos los ratings asociados a un postId
        const ratings = await ctx.prisma.rating.findMany({
          where: { postId: input.postId },
          select: { rating: true },
        });

        if (!ratings.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No ratings found for this post",
          });
        }

        // Calcular el promedio de rating del post
        const averageRating =
          ratings.reduce((sum: any, r: { rating: any }) => sum + r.rating, 0) /
          ratings.length;

        return { averageRating, totalRatings: ratings.length };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ratings",
          cause: error,
        });
      }
    }),

  getMostRatedPostByCategory: t.procedure.query(async ({ ctx }) => {
    try {
      const topRatedPosts = await ctx.prisma.post.groupBy({
        by: ["categoria"], // Agrupar por categoría
        _max: {
          avgRating: true, // Obtener el mayor avgRating en cada categoría
        },
      });

      // Obtener los posts completos con el max avgRating en cada categoría
      const mostRatedPosts = await Promise.all(
        topRatedPosts.map(async (group) => {
          return ctx.prisma.post.findFirst({
            where: {
              categoria: group.categoria,
              avgRating: group._max.avgRating!,
            },
          });
        })
      );

      return mostRatedPosts;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching top-rated posts by category",
        cause: error,
      });
    }
  }),
});
