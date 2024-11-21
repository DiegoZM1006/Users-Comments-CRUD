import mongoose from "mongoose";
import { UserReaction, TypeReaction } from "./user.model.js";

// Definición de la interfaz para la entrada de datos de un comentario
export interface CommentInput {
    content: string;         // Contenido del comentario
    author?: string;         // ID del autor del comentario (opcional)
    reply?: CommentInput[];  // Respuestas al comentario (opcional)
    reaction?: UserReaction[]; // Reacciones al comentario (opcional)
}

// Definición de la interfaz para el documento de un comentario en la base de datos
export interface CommentDocument extends CommentInput, mongoose.Document {
    createdAt: Date;  // Fecha de creación
    updatedAt: Date;  // Fecha de última actualización
    deletedAt: Date;  // Fecha de eliminación
}

// Esquema de Mongoose para el documento de comentarios
const DocumentSchema = new mongoose.Schema({
    content: { type: String, required: true },  // Contenido del comentario, obligatorio
    author: { type: String, required: true },   // ID del autor, obligatorio
    reply: { type: Array, default: [] },        // Respuestas, por defecto es un array vacío
    reaction: {
        type: [
            {
                id: { type: String, required: true },         // ID de la reacción, obligatorio
                userId: { type: String, required: true },     // ID del usuario que reaccionó, obligatorio
                type: {
                    type: String,
                    enum: Object.values(TypeReaction),        // Tipo de reacción, basado en una enumeración
                    required: true,
                }
            }
        ],
        default: [],  // Reacciones, por defecto es un array vacío
    },
}, { timestamps: true, collection: 'comments' });  // Timestamps para createdAt y updatedAt, colección 'comments'

// Creación del modelo de Mongoose para el comentario
const Comment = mongoose.model<CommentDocument>('Comment', DocumentSchema);

export default Comment;
