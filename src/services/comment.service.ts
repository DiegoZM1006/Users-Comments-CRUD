import CommentModel, { CommentDocument } from "../models/comment.model";
import { UUID } from "mongodb";
import mongoose from "mongoose";

class CommentService {
    // Obtiene todos los comentarios
    async getComments(): Promise<CommentDocument[]> {
        try {
            return await CommentModel.find();
        } catch (error) {
            throw error;
        }
    }

    // Crea un nuevo comentario
    async createComment(comment: CommentDocument): Promise<CommentDocument> {
        try {
            return await CommentModel.create(comment);
        } catch (error) {
            throw error;
        }
    }

    // Actualiza un comentario por ID
    async updateComment(id: string, comment: CommentDocument): Promise<CommentDocument | null> {
        try {
            return await CommentModel.findByIdAndUpdate(id, comment, { 
                returnOriginal: false,
            });
        } catch (error) {
            throw error;
        }
    }

    // Elimina un comentario por ID
    async deleteComment(id: string): Promise<CommentDocument | null> {
        try {
            return await CommentModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    // Agrega una reacción a un comentario
    async reactToComment(id: string, type: string, loggedUser: string): Promise<CommentDocument | null> {
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

    // Elimina una reacción de un comentario
    async unreactToComment(commentId: string, reactionId: string): Promise<CommentDocument | null> {
        try {
            const comment = await CommentModel.findById(commentId);
            if (!comment) {
                throw new Error('Comentario no encontrado');
            }
            comment.reaction = comment.reaction?.filter(r => r.id.toString() !== reactionId);
            await comment.save();
            return comment;
        } catch (error) {
            throw error;
        }
    }
    
    // Añade una respuesta de forma recursiva a un comentario
    async addReplyRecursively(comment: CommentDocument, targetId: string, newReply: any): Promise<boolean> {
        try {
            if (comment.id.toString() === targetId.toString()) {
                comment.reply?.push(newReply);
                return true;
            }
            if (comment.reply) {
                for (let reply of comment.reply) {
                    const found = await this.addReplyRecursively(reply, targetId, newReply);
                    if (found) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    // Actualiza una respuesta de forma recursiva
    async updateReplyRecursively(comment: CommentDocument, targetId: string, newReply: any): Promise<boolean> {
        try {
            if (comment.id.toString() === targetId.toString()) {
                comment.content = newReply.content;
                return true;
            }
            if (comment.reply) {
                for (let reply of comment.reply) {
                    const found = await this.updateReplyRecursively(reply, targetId, newReply);
                    if (found) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    
    // Crea un comentario anidado
    async createNestedComment(id: string, targetId: string, comment: CommentDocument): Promise<CommentDocument | null> {
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
            await parentComment.save();
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    // Actualiza un comentario anidado
    async updateNestedComment(id: string, targetId: string, comment: CommentDocument): Promise<CommentDocument | null> {
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
            await parentComment.save();
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    // Elimina una respuesta de forma recursiva
    async deleteReplyRecursively(comment: CommentDocument, targetId: string): Promise<boolean> {
        try {
            if (comment.reply) {
                for (let i = 0; i < comment.reply.length; i++) {
                    const reply = comment.reply[i] as CommentDocument;
                    if (reply.id.toString() === targetId.toString()) {
                        comment.reply.splice(i, 1);
                        return true;
                    }
                    const found = await this.deleteReplyRecursively(reply, targetId);
                    if (found) {
                        return true;
                    }
                }
            }
            if (comment.id.toString() === targetId.toString()) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    // Elimina un comentario anidado
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
            await parentComment.save();
            return parentComment;
        } catch (error) {
            throw error;
        }
    }
    
    // Añade una reacción a una respuesta de forma recursiva
    async addReactionToReplyRecursively(comment: CommentDocument, targetId: string, reaction: any): Promise<boolean> {
        try {
            if (comment.id.toString() === targetId.toString()) {
                comment.reaction?.push(reaction);
                return true;
            }
            if (comment.reply) {
                for (let reply of comment.reply) {
                    const found = await this.addReactionToReplyRecursively(reply, targetId, reaction);
                    if (found) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    
    // Reacciona a un comentario anidado
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
            await parentComment.save();
            return parentComment;
        } catch (error) {
            throw error;
        }
    }

    // Elimina una reacción de una respuesta de forma recursiva
    async removeReactionFromReplyRecursively(comment: CommentDocument, targetId: string, reactionId: string): Promise<boolean> {
        try {
            if (comment.id.toString() === targetId.toString()) {
                comment.reaction = comment.reaction?.filter(r => r.id.toString() !== reactionId.toString());
                return true;
            }
            if (comment.reply) {
                for (let reply of comment.reply) {
                    const found = await this.removeReactionFromReplyRecursively(reply, targetId, reactionId);
                    if (found) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    
    // Elimina una reacción de un comentario anidado
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
            await parentComment.save();
            return parentComment;
        } catch (error) {
            throw error;
        }
    }
}

export default new CommentService();
