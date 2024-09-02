import { NextFunction, Request, Response } from 'express';
import Comment from '../models/comment.model';
import commentService from '../services/comment.service';

// Middleware para eliminar un comentario
export const validateAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;
        const userId = req.params.idLoggedUser; // Asumiendo que el ID del usuario autenticado está disponible en req.user._id

        // 1. Buscar el comentario
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // 2. Verificar que el usuario autenticado es el autor del comentario
        if (comment.author?.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Esta accion no esta autorizada para este comentario' });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: 'Error al hacer esta accion en el comentario', error });
    }
};

// Middleware para validar que el usuario es el autor del comentario o respuesta
export const validateReplyAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: commentId, targetId } = req.params; // `targetId` es la ID de la respuesta dentro del comentario
        const userId = req.params.idLoggedUser; // ID del usuario autenticado, asumiendo que está disponible en `req.user._id`

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

            if (comment.reply && comment.reply.length > 0) {
                for (let reply of comment.reply) {
                    if (findAndValidateAuthor(reply, targetId)) {
                        return false;
                    }
                }
            }
            return true;
        };

        const isAuthor = findAndValidateAuthor(parentComment, targetId);

        if (!isAuthor) {
            return res.status(403).json({ message: 'No estás autorizado para modificar esta respuesta' });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: 'Error al validar el autor de la respuesta', error });
    }
};
