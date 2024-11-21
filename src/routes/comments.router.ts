import express, {Request, Response} from "express";
import commentsController from "../controllers/comments.controller.js";
import { auth, authorize } from "../middlewares/auth.js";
import { validateAuthor } from "../middlewares/validateAuthor.js";
import { validateAuthorReaction } from "../middlewares/validateAuthorReaction.js";
import { validateReplyAuthor } from '../middlewares/validateAuthor.js';
import { validateReplyAuthorReaction } from '../middlewares/validateAuthorReaction.js';
import validateSchema from "../middlewares/validateSchema.js";
import CommentSchema from "../schemas/comment.schema.js";
import ReactionSchema from "../schemas/reaction.schema.js";

export const routerComments = express.Router();

// Rutas para la gestion de comentarios en la API
routerComments.get("/", auth, commentsController.getComments); // GET ALL COMMENTS

routerComments.post("/", auth, commentsController.createComment); // CREATE A NEW COMMENT

routerComments.put("/:id", auth, validateAuthor, commentsController.updateComment); // UPDATE A COMMENT

routerComments.delete("/:id", auth, validateAuthor, commentsController.deleteComment); // DELETE A COMMENT

// Reaccionar a un comentario
routerComments.post("/:id/reactions", validateSchema(ReactionSchema), auth, commentsController.reactToComment); // REACT TO A COMMENT

routerComments.delete("/:id/reactions/:reactionId", auth, validateAuthorReaction, commentsController.unreactToComment); // UNREACT TO A COMMENT

// Comentarios anidados
routerComments.post("/:id/comments/:targetId", auth, commentsController.createNestedComment); // CREATE A NESTED COMMENT

routerComments.put("/:id/comments/:targetId", auth, validateReplyAuthor, commentsController.updateNestedComment); // UPDATE A NESTED COMMENT

routerComments.delete("/:id/comments/:targetId", auth, validateReplyAuthor,  commentsController.deleteNestedComment); // DELETE A NESTED COMMENT

// Reaccionar a comentarios anidados
routerComments.post("/:id/comments/:targetId/reactions", validateSchema(ReactionSchema), auth, commentsController.reactToNestedComment); // REACT TO A NESTED COMMENT

routerComments.delete("/:id/comments/:targetId/reactions/:reactionId", auth, validateReplyAuthorReaction,  commentsController.unreactToNestedComment); // UNREACT TO A NESTED COMMENT

