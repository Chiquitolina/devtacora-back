import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPostSchema, updatePostSchema } from "../schemas/posts.schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { t } from "../config/tRCP";

export const postRouter = t.router({
  // Crear un nuevo post
  create: t.procedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("Recibido en backend:", input); // <-- esto

        return await ctx.prisma.post.create({
          data: {
            titulo: input.titulo,
            contenido: input.contenido,
            descripcion: input.descripcion,
            img: input.img,
            categoria: input.categoria,
            subcategoria: input.subcategoria,
            lenguaje: input.lenguaje,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al crear el post.",
          cause: error,
        });
      }
    }),

  // Obtener todos los posts
  getAll: t.procedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.post.findMany();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al obtener los posts.",
        cause: error,
      });
    }
  }),

  getAllLimit: t.procedure
    .input(z.number().optional()) // Cambiamos a z.number().optional()
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.findMany({
          take: input || undefined, // Usamos directamente el número como límite
          orderBy: {
            createdAt: "desc", // Ordena por fecha descendente
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener los posts.",
          cause: error,
        });
      }
    }),

  // Obtener un post por su ID
  getById: t.procedure.input(z.number()).query(async ({ input, ctx }) => {
    try {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post con ID ${input} no encontrado.`,
        });
      }
      return post;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al obtener el post.",
        cause: error,
      });
    }
  }),

  // Actualizar un post
  update: t.procedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedPost = await ctx.prisma.post.update({
          where: { id: input.id },
          data: {
            titulo: input.titulo,
            contenido: input.contenido,
            descripcion: input.descripcion,
            img: input.img,
            categoria: input.categoria,
            subcategoria: input.subcategoria,
            lenguaje: input.lenguaje,
          },
        });
        return updatedPost;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Post con ID ${input.id} no encontrado.`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al actualizar el post.",
          cause: error,
        });
      }
    }),

  // Eliminar un post
  delete: t.procedure.input(z.number()).mutation(async ({ input, ctx }) => {
    try {
      return await ctx.prisma.post.delete({
        where: { id: input },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post con ID ${input} no encontrado.`,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al eliminar el post.",
        cause: error,
      });
    }
  }),
});

export type PostRouter = typeof postRouter;
