import { Request, Response, NextFunction } from 'express';
import Comment from '../models/comment.model';

// Middleware para verificar la propiedad de la reacción
export const validateAuthorReaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, reactionId } = req.params;
        const userId = req.params.idLoggedUser; // ID del usuario autenticado

        // Buscar el comentario
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Buscar la reacción dentro del comentario
        const reaction = comment.reaction?.find(r => r.id.toString() === reactionId.toString());

        if (!reaction) {
            return res.status(404).json({ message: 'Reacción no encontrada' });
        }

        // Verificar si el usuario autenticado es el dueño de la reacción
        if (reaction.userId !== userId) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta reacción' });
        }

        // Si todo está bien, continuar con la solicitud
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al validar la propiedad de la reacción', error });
    }
};

// Función recursiva para buscar una reacción en los comentarios y respuestas
const findReactionInRepliesRecursively = (comment: any, reactionId: string): any => {
    // Buscar la reacción en el comentario actual
    const reaction = comment.reaction?.find((r: { id: { toString: () => string; }; }) => r.id.toString() === reactionId.toString());
    if (reaction) return reaction;

    // Buscar en las respuestas de manera recursiva
    if (comment.reply) {
        for (const reply of comment.reply) {
            const foundReaction = findReactionInRepliesRecursively(reply, reactionId);
            if (foundReaction) return foundReaction;
        }
    }

    return null;
};

// Middleware para verificar la propiedad de la reacción
export const validateReplyAuthorReaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, reactionId } = req.params;
        const userId = req.params.idLoggedUser; // ID del usuario autenticado

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        // Buscar el comentario principal
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Buscar la reacción de manera recursiva
        const reaction = findReactionInRepliesRecursively(comment, reactionId);

        if (!reaction) {
            return res.status(404).json({ message: 'Reacción no encontrada' });
        }

        // Verificar si el usuario autenticado es el dueño de la reacción
        if (reaction.userId !== userId) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta reacción' });
        }

        // Si todo está bien, continuar con la solicitud
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al validar la propiedad de la reacción', error });
    }
};
