import { NextFunction, Request, Response } from 'express';
import Comment from '../models/comment.model.js';
import commentService from '../services/comment.service.js';

// Middleware para validar que el usuario autenticado es el autor del comentario
export const validateAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;
        const userId = req.params.idLoggedUser; // ID del usuario autenticado

        // 1. Buscar el comentario en la base de datos
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // 2. Verificar que el usuario autenticado es el autor del comentario
        if (comment.author?.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Esta acción no está autorizada para este comentario' });
        }

        // Continuar con la siguiente función del middleware
        next();
    } catch (error) {
        // Manejar errores y responder con un error 500
        return res.status(500).json({ message: 'Error al realizar esta acción en el comentario', error });
    }
};

// Middleware para validar que el usuario autenticado es el autor de una respuesta dentro de un comentario
export const validateReplyAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: commentId, targetId } = req.params; // `targetId` es la ID de la respuesta dentro del comentario
        const userId = req.params.idLoggedUser; // ID del usuario autenticado

        // Buscar el comentario padre
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Función recursiva para encontrar la respuesta objetivo y validar al autor
        const findAndValidateAuthor = (comment: any, targetId: string): boolean => {
            if (comment.id.toString() === targetId.toString()) {
                return comment.author.toString() === userId.toString();
            }

            // Buscar en las respuestas del comentario
            if (comment.reply && comment.reply.length > 0) {
                for (let reply of comment.reply) {
                    if (findAndValidateAuthor(reply, targetId)) {
                        return true; // Autor encontrado
                    }
                }
            }
            return false; // Autor no encontrado
        };

        const isAuthor = findAndValidateAuthor(parentComment, targetId);

        // Verificar si el usuario es el autor de la respuesta
        if (!isAuthor) {
            return res.status(403).json({ message: 'No estás autorizado para modificar esta respuesta' });
        }

        next();
    } catch (error) {
        // Manejar errores y responder con un error 500
        return res.status(500).json({ message: 'Error al validar el autor de la respuesta', error });
    }
};
