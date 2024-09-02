import mongoose from "mongoose";
import { UserReaction, TypeReaction } from "./user.model";

export interface CommentInput {
    content: string;
    author?: string;
    reply?: CommentInput[];
    reaction?: UserReaction[];
}

export interface CommentDocument extends CommentInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const DocumentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    reply: { type: Array, default: [] },
    reaction: {
        type: [
            {
                id: { type: String, required: true },
                userId: { type: String, required: true },
                type: {
                    type: String,
                    enum: Object.values(TypeReaction),
                    required: true,
                }
            }
        ],
        default: [],
    },
}, { timestamps: true, collection: 'comments' });

const Comment = mongoose.model<CommentDocument>('Comment', DocumentSchema);

export default Comment;