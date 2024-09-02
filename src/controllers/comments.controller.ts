import { CommentDocument } from "../models/comment.model";
import { Request, Response } from "express";
import CommentService from "../services/comment.service";

class CommentsController {
    public getComments = async (req: Request, res: Response) => {
        try {
            const comments: CommentDocument[] = await CommentService.getComments();
            return res.status(200).json({ comments });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public createComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument = await CommentService.createComment({
                ...req.body,
                author: req.params.idLoggedUser,
            });
            return res.status(201).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public updateComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.updateComment(req.params.id, req.body);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.deleteComment(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public reactToComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.reactToComment(req.params.id, req.body.type, req.params.idLoggedUser);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public unreactToComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.unreactToComment(req.params.id, req.params.reactionId);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }


    public createNestedComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.createNestedComment(req.params.id, req.params.targetId, req.body);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public updateNestedComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.updateNestedComment(req.params.id, req.params.targetId, req.body);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public deleteNestedComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.deleteNestedComment(req.params.id, req.params.targetId);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public reactToNestedComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.reactToNestedComment(req.params.id, req.params.targetId, req.body.type, req.params.idLoggedUser);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public unreactToNestedComment = async (req: Request, res: Response) => {
        try {
            const comment: CommentDocument | null = await CommentService.removeReactionFromNestedComment(req.params.id, req.params.targetId, req.params.reactionId);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ comment });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default new CommentsController();