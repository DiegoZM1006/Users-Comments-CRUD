import CommentModel, { CommentDocument, CommentInput } from "../models/comment.model.js";
import { UUID } from "mongodb";
import mongoose from "mongoose";

class CommentService {
    async getComments(): Promise<CommentDocument[]> {
        try {
            return await CommentModel.find();
        } catch (error) {
            throw error;
        }
    }

    async createComment(comment: CommentDocument): Promise<CommentDocument> {
        try {
            return await CommentModel.create(comment);
        } catch (error) {
            throw error;
        }
    }

    async updateComment(id: string, comment: CommentDocument): Promise<CommentDocument | null> {
        try {
            return await CommentModel.findByIdAndUpdate(id, comment, { 
                returnOriginal: false,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteComment(id: string): Promise<CommentDocument | null> {
        try {
            return await CommentModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async reactToComment(id: string, type: string, loggedUser : string): Promise<CommentDocument | null> {
        try {
            return await CommentModel.findByIdAndUpdate(id, {
                $push: { reaction: {id: new mongoose.Types.ObjectId, type: type, userId: loggedUser} },
        }, {
                returnOriginal: false,
        });
        } catch (error) {
            throw error;
        }
    }

    async unreactToComment(commentId: string, reactionId: string): Promise<CommentDocument | null> {
        try {
            // 1. Encontrar el comentario por ID
            const comment = await CommentModel.findById(commentId);
            if (!comment) {
                throw new Error('Comentario no encontrado');
            }
    
            // 2. Filtrar la reacción que queremos eliminar
            const updatedReactions = comment.reaction?.filter(r => r.id.toString() !== reactionId);
    
            // 3. Actualizar el array de reacciones
            comment.reaction = updatedReactions;
    
            // 4. Guardar el comentario actualizado
            await comment.save();
    
            return comment;
        } catch (error) {
            throw error;
        }
    }
    
    async addReplyRecursively(comment: CommentDocument, targetId: string, newReply: any): Promise<boolean>  {
        try {
            if (comment.id.toString() === targetId.toString()) {
                comment.reply?.push(newReply);
                return true;
            }
    
            // Recorremos las respuestas para buscar recursivamente
            if (comment.reply) {
                for (let i = 0; i < comment.reply.length; i++) {
                    const reply = comment.reply[i] as CommentDocument;
                    const found = await this.addReplyRecursively(reply, targetId, newReply);
                    if (found) {
                        // Asegúrate de asignar de nuevo la respuesta modificada
                        comment.reply[i] = reply;
                        return true;
                    }
                }
            }
    
            return false;
        } catch (error) {
            throw error;
        }
    }

    async updateReplyRecursively(comment: CommentDocument, targetId: string, newReply: any): Promise<boolean>  {
        try {

            if (comment.id.toString() === targetId.toString()) {
                comment.content = newReply.content;
                return true;
            }
    
            // Recorremos las respuestas para buscar recursivamente
            if (comment.reply) {
                for (let i = 0; i < comment.reply.length; i++) {
                    const reply = comment.reply[i] as CommentDocument;
                    const found = await this.updateReplyRecursively(reply, targetId, newReply);
                    if (found) {
                        // Asegúrate de asignar de nuevo la respuesta modificada
                        comment.reply[i] = reply;
                        return true;
                    }
                }
            }
    
            return false;
        } catch (error) {
            throw error;
        }
    }
    
    async createNestedComment(id: string, targetId:string,  comment: CommentDocument): Promise<CommentDocument | null> {
        try {
            const parentComment = await CommentModel.findById(id);
    
            if (!parentComment) {
                throw new Error('Comentario no encontrado');
            }
    
            const newReply = {
                id: new mongoose.Types.ObjectId(),
                content: comment.content,
                author: comment.author,
                reply: [],
                reaction: [],
            };
    
            const found = await this.addReplyRecursively(parentComment, targetId, newReply);
    
            if (!found) {
                throw new Error('No se encontró el comentario o la respuesta objetivo');
            }
    
            // Guarda los cambios en la base de datos
            await parentComment.save();
    
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    async updateNestedComment(id: string, targetId:string,  comment: CommentDocument): Promise<CommentDocument | null> {
        try {
            const parentComment = await CommentModel.findById(id);
    
            if (!parentComment) {
                throw new Error('Comentario no encontrado');
            }
    
            const newReply = {
                id: targetId,
                content: comment.content,
            };
    
            const found = await this.updateReplyRecursively(parentComment, targetId, newReply);
    
            if (!found) {
                throw new Error('No se encontró el comentario o la respuesta objetivo');
            }
    
            // Guarda los cambios en la base de datos
            await parentComment.save();
    
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    async deleteReplyRecursively(comment: CommentDocument, targetId: string): Promise<boolean> {
        try {

            // Recorre las respuestas para buscar recursivamente
            if (comment.reply && comment.reply.length > 0) {
                for (let i = 0; i < comment.reply.length; i++) {
                    const reply = comment.reply[i] as CommentDocument;
    
                    // Verifica si la respuesta actual es la que se desea eliminar
                    if (reply.id.toString() === targetId.toString()) {
                        comment.reply.splice(i, 1); // Elimina la respuesta del array de respuestas
                        return true; // Devuelve true si se ha encontrado y eliminado
                    }
    
                    const found = await this.deleteReplyRecursively(reply, targetId);
                    if (found) {
                        comment.reply[i] = reply;
                        return true; // Devuelve true si se ha encontrado y eliminado en algún nivel más profundo
                    }
                }
            } 
            
            if (comment.id.toString() === targetId.toString()) {
                return true; // Devuelve true si es el comentario objetivo
            }
    
            return false; // Devuelve false si no se encuentra el comentario objetivo
        } catch (error) {
            throw error;
        }
    }

    async deleteNestedComment(id: string, targetId: string): Promise<CommentDocument | null> {
        try {
            const parentComment = await CommentModel.findById(id);
    
            if (!parentComment) {
                throw new Error('Comentario no encontrado');
            }
    
            const found = await this.deleteReplyRecursively(parentComment, targetId);
    
            if (!found) {
                throw new Error('No se encontró el comentario o la respuesta objetivo');
            }
    
            // Guarda los cambios en la base de datos después de eliminar la respuesta
            await parentComment.save();
    
            return parentComment;
        } catch (error) {
            throw error;
        }
    }
    
    async addReactionToReplyRecursively(comment: CommentDocument, targetId: string, reaction: any): Promise<boolean> {
        try {
            // Verifica si la respuesta actual es la que se desea agregar la reacción
            if (comment.id.toString() === targetId.toString()) {
                comment.reaction?.push(reaction);
                return true;
            }
    
            // Recorre las respuestas de manera recursiva para buscar el targetId
            if (comment.reply) {
                for (let i = 0; i < comment.reply.length; i++) {
                    const reply = comment.reply[i] as CommentDocument;
                    const found = await this.addReactionToReplyRecursively(reply, targetId, reaction);
                    if (found) {
                        // Asegúrate de asignar de nuevo la respuesta modificada
                        comment.reply[i] = reply;
                        return true;
                    }
                }
            }
    
            return false;
        } catch (error) {
            throw error;
        }
    }
    
    async reactToNestedComment(id: string, targetId: string, type: string, userId: string): Promise<CommentDocument | null> {
        try {
            const parentComment = await CommentModel.findById(id);
    
            if (!parentComment) {
                throw new Error('Comentario no encontrado');
            }
    
            const newReaction = {
                id: new mongoose.Types.ObjectId(),
                type: type,
                userId: userId,
            };
    
            const found = await this.addReactionToReplyRecursively(parentComment, targetId, newReaction);
    
            if (!found) {
                throw new Error('No se encontró la respuesta objetivo');
            }
    
            // Guarda los cambios en la base de datos
            await parentComment.save();
    
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    async removeReactionFromReplyRecursively(comment: CommentDocument, targetId: string, reactionId: string): Promise<boolean> {
        try {
            // Verifica si la respuesta actual es la que se desea eliminar la reacción
            if (comment.id.toString() === targetId.toString()) {
                comment.reaction = comment.reaction?.filter(r => r.id.toString() !== reactionId.toString());
                return true;
            }
    
            // Recorre las respuestas de manera recursiva para buscar el targetId
            if (comment.reply) {
                for (let i = 0; i < comment.reply.length; i++) {
                    const reply = comment.reply[i] as CommentDocument;
                    const found = await this.removeReactionFromReplyRecursively(reply, targetId, reactionId);
                    if (found) {
                        // Asegúrate de asignar de nuevo la respuesta modificada
                        comment.reply[i] = reply;
                        return true;
                    }
                }
            }
    
            return false;
        } catch (error) {
            throw error;
        }
    }
    
    async removeReactionFromNestedComment(id: string, targetId: string, reactionId: string): Promise<CommentDocument | null> {
        try {
            const parentComment = await CommentModel.findById(id);
    
            if (!parentComment) {
                throw new Error('Comentario no encontrado');
            }

            const found = await this.removeReactionFromReplyRecursively(parentComment, targetId, reactionId);

            if (!found) {
                throw new Error('No se encontró la respuesta objetivo');
            }

            // Guarda los cambios en la base de datos
            console.log(parentComment);
            await parentComment.save();
    
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    async getCommentById(id: string): Promise<CommentInput | null> {
        try {
            const comment = await CommentModel.findById(id)
            .populate("reply") 
            .populate("reaction");
    
            if (!comment) {
            throw new Error("Comentario no encontrado");
        }
    
            return comment;

        } catch (error) {
            throw new Error(`Error al obtener el comentario `);
        }
    }

}

export default new CommentService();