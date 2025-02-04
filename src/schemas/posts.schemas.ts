import { z } from "zod";

export const createPostSchema = z.object({
  titulo: z.string().max(80, "El título no puede exceder 80 caracteres."),
  contenido: z.string().min(10, "El contenido debe tener al menos 10 caracteres."),
  descripcion: z.string().max(255, "La descripción no puede exceder 255 caracteres."),
  img: z.string().max(500, "La URL de la imagen no puede exceder 500 caracteres."),
  categoria: z.string().max(100, "La categoría no puede exceder 100 caracteres."),
  subcategoria: z.string().max(100, "La subcategoría no puede exceder 100 caracteres."),
  lenguaje: z.string().max(50, "El lenguaje no puede exceder 50 caracteres.").nullable(),
});

export const updatePostSchema = z.object({
    id: z.number().int(), // El `id` es necesario para encontrar el post que se actualizará
    titulo: z.string().optional(),
    contenido: z.string().optional(),
    descripcion: z.string().optional(),
    img: z.string().optional(),
    categoria: z.string().optional(),
    subcategoria: z.string().optional(),
    lenguaje: z.string().optional(),
  });

type createPost = z.infer<typeof createPostSchema>;
type updatePost = z.infer<typeof updatePostSchema>;
