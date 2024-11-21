import userService from "../services/user.service";
import commentService from "../services/comment.service";
import { UserDocument, UserInput } from "../models/user.model";
import { CommentDocument, CommentInput } from "../models/comment.model";
import UserService from "../services/user.service";
import {GraphQLError} from "graphql";


const validateUserComment = async (commentId: string, userId: string) => {
    const comment = await commentService.getCommentById(commentId);
    if (comment?.author?.toString() !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};

const validateRole = (requiredRoles: string[], role: string) => {
    if (!requiredRoles.includes(role)) {
        throw new GraphQLError("Acceso denegado", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};

export const resolvers = {
    Query:{

        getUser: async (_root: any, params: any) => {
            try {
                const user: UserDocument | null = await userService.findById(params.id);
                if (!user) throw new GraphQLError("Usuario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        getUsers: async () => {
            try {
                const user: UserDocument[] | null = await userService.findAll();
                if (!user) throw new GraphQLError("Usuario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        getUserByEmail: async (_root: any, params: any) => {
            try {
                const user: UserDocument | null = await userService.findByEmail(params.email);
                if (!user) throw new GraphQLError("Usuario no encontrado con el correo proporcionado", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el usuario por correo: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        getComments: async () => {
            try{
                const comments: CommentDocument[] | null = await commentService.getComments();
                if(!comments) throw new GraphQLError("Comentarios no encontrados", { extensions: { code: "NOT_FOUND" } });
                return comments;
            }catch(error){
                throw new GraphQLError(`Error al obtener los comentarios: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        getCommentById: async (_root: any, params: any) => {
            try {
                const comment: CommentInput | null = await commentService.getCommentById(params.id);
                if (!comment) throw new GraphQLError("Comentario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

    },

    Mutation: {
        login: async (_: any, { input }: { input: { email: string; password: string } }) => {
          try {
            const user = await UserService.login(input);
            return user; // Devuelve email, name, role y token desde el servicio
          } catch (error) {
            throw new Error(`Login failed: ${error}`);
          }
        },

        createUser: async (_root: any, params: any, context: any) => {
            try {
                validateRole(['superadmin'], context.user.role);
                const userOutput: UserDocument = await userService.createUser(params.input as UserInput);
                return userOutput;
            } catch (error) {
                throw new GraphQLError(`Error al crear el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        updateUser: async (_root: any, params: any, context: any) => {
            try {
                validateRole(['superadmin'], context.user.role);
                const user: UserDocument | null = await userService.updateUser(params.id, params.input as UserInput);
                if (!user) throw new GraphQLError("Usuario no encontrado para actualizar", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        deleteUser: async (_root: any, params: any, context: any) => {
            try {
                validateRole(['superadmin'], context.user.role);
                const user: UserDocument | null = await userService.deleteUser(params.id);
                if (!user) throw new GraphQLError("Usuario no encontrado para eliminar", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        createComment: async (_root: any, params: any, context: any) => {
            try {
                params.input.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.createComment(params.input);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al crear el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        updateComment: async (_root: any, params: any, context: any) => {
            try {
                await validateUserComment(params.id, context.user.user_id);
                const comment: CommentDocument | null = await commentService.updateComment(params.id, params.content);
                if (!comment) throw new GraphQLError("Comentario no encontrado para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        
        deleteComment: async (_root: any, params: any, context: any) => {
            try {
                await validateUserComment(params.input.commentId, context.user.user_id);
                const comment: CommentDocument | null = await commentService.deleteComment(params.id);
                if (!comment) throw new GraphQLError("Comentario no encontrado para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        reactToComment: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.reactToComment(params.commentId, params.input.type, params.userId);
                console.log(comment)
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        unreactToComment: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.unreactToComment(params.commentId, params.reactionId);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        addReplyToComment: async (_root: any, params: any, context: any) => {
            try {
                const userId = context.user.user_id; // Usuario autenticado
                const newReply = {
                    ...params.input,
                    author: params.input.author || userId, // Asegúrate de incluir un autor
                };
        
                const comment: CommentDocument | null = await commentService.createNestedComment(
                    params.commentId,
                    params.replyId,
                    newReply
                );
        
                if (!comment) {
                    throw new GraphQLError("No se pudo agregar la respuesta", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
                }
        
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        updateNestedComment: async (_root: any, params: any, context: any) => {
            try {
                const userId = context.user.user_id;
        
                // Validar que el usuario sea el autor del comentario
                const parentComment = await commentService.getCommentById(params.commentId);
                if (!parentComment) {
                    throw new GraphQLError("Comentario padre no encontrado", { extensions: { code: "NOT_FOUND" } });
                }
        
                // Buscar y validar que el reply pertenece al usuario
                const targetReply = parentComment.reply?.find(
                    (reply: any) => reply.id.toString() === params.replyId.toString()
                );
                if (!targetReply) {
                    throw new GraphQLError("Respuesta objetivo no encontrada", { extensions: { code: "NOT_FOUND" } });
                }
        
                if (targetReply.author !== userId) {
                    throw new GraphQLError("No tienes permiso para actualizar esta respuesta", {
                        extensions: { code: "FORBIDDEN" },
                    });
                }
        
                // Realizar la actualización de la respuesta
                const updatedComment = await commentService.updateNestedComment(
                    params.commentId,
                    params.replyId,
                    params.input
                );
        
                if (!updatedComment) {
                    throw new GraphQLError("No se pudo actualizar la respuesta", {
                        extensions: { code: "INTERNAL_SERVER_ERROR" },
                    });
                }
        
                return updatedComment;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar la respuesta: ${error}`, {
                    extensions: { code: "INTERNAL_SERVER_ERROR" },
                });
            }
        },
        deleteNestedComment: async (_root: any, params: any, context: any) => {
            try {
                const userId = context.user.user_id;
        
                // Validar que el usuario sea el autor del comentario
                const parentComment = await commentService.getCommentById(params.commentId);
                if (!parentComment) {
                    throw new GraphQLError("Comentario padre no encontrado", { extensions: { code: "NOT_FOUND" } });
                }
        
                // Buscar y validar que el reply pertenece al usuario
                const targetReply = parentComment.reply?.find(
                    (reply: any) => reply.id.toString() === params.replyId.toString()
                );
                if (!targetReply) {
                    throw new GraphQLError("Respuesta objetivo no encontrada", { extensions: { code: "NOT_FOUND" } });
                }
        
                if (targetReply.author !== userId) {
                    throw new GraphQLError("No tienes permiso para eliminar esta respuesta", {
                        extensions: { code: "FORBIDDEN" },
                    });
                }
        
                // Realizar la eliminación de la respuesta
                const updatedComment = await commentService.deleteNestedComment(params.commentId, params.replyId);
        
                if (!updatedComment) {
                    throw new GraphQLError("No se pudo eliminar la respuesta", {
                        extensions: { code: "INTERNAL_SERVER_ERROR" },
                    });
                }
        
                return updatedComment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar la respuesta: ${error}`, {
                    extensions: { code: "INTERNAL_SERVER_ERROR" },
                });
            }
        },
        reactToNestedComment: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.reactToNestedComment(params.commentId, params.replyId, params.input.type, params.userId);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        removeReactionFromNestedComment: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.removeReactionFromNestedComment(params.commentId, params.replyId, params.reactionId);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        }  
        
        

    },
}






