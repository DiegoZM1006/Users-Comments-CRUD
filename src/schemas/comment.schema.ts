import { z } from "zod";

// Definición de posibles reacciones del usuario
const UserReactionEnum = z.enum([
  "like",
  "dislike",
  "love",
]);

// Esquema para la reacción de un usuario
export const UserReactionSchema = z.object({
  type: UserReactionEnum,
});

// Esquema para un comentario
const CommentSchema: any = z.object({
  content: z.string().min(1, "El contenido del comentario es requerido"), // Cadena obligatoria y no vacía
  author: z.string().min(1, "El autor es requerido"), // Cadena obligatoria y no vacía
  reply: z.array(z.lazy(() => CommentSchema)).optional(), // Arreglo opcional de subcomentarios
  reaction: z.array(UserReactionSchema).optional(), // Arreglo opcional de reacciones
});

// Exporta el tipo derivado de Zod
export default CommentSchema;
