import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { t } from "../config/tRCP";

export const filterPostRouter = t.router({
  filter: t.procedure
    .input(
      z.object({
        categoria: z.string(),
        subcategoria: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { categoria, subcategoria } = input;

      try {
        // Buscar posts filtrados
        const filteredPosts = await ctx.prisma.post.findMany({
          where: {
            categoria, // Siempre incluye `categoria` porque no es opcional
            ...(subcategoria && { subcategoria }), // Agrega `subcategoria` solo si tiene valor
          },
        });

        // Retornar siempre un array (puede ser vacío)
        return filteredPosts;
      } catch (error) {
        // Manejo de errores generales
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener los posts.",
          cause: error,
        });
      }
    }),

  filterq: t.procedure
    .input(
      z.object({
        categoria: z.string(),
        subcategoria: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      console.log("Received input:", input); // Log para ver lo que llega
      const { categoria, subcategoria } = input;

      try {
        // Buscar posts filtrados
        const filteredPosts = await ctx.prisma.post.findMany({
          where: {
            categoria, // Siempre incluye `categoria` porque no es opcional
            ...(subcategoria && { subcategoria }), // Agrega `subcategoria` solo si tiene valor
          },
        });

        if (!filteredPosts || filteredPosts.length === 0) {
          const message = subcategoria
            ? `No se encontraron posts para la categoría: ${categoria} y subcategoría: ${subcategoria}.`
            : `No se encontraron posts para la categoría: ${categoria}.`;

          // Retornar un JSON con el mensaje y un array vacío
          return {
            message,
            filteredPosts: [],
          };
        }

        return {
          message: "Posts encontrados exitosamente.",
          filteredPosts,
        };
      } catch (error) {
        // Manejo de errores generales
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener los posts.",
          cause: error,
        });
      }
    }),
});
