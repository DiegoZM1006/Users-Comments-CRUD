import mongoose from 'mongoose';

export interface UserInput {
    name: string;
    email: string;
    password: string;
    role: string;
}

export enum TypeReaction {
    LIKE = 'like',
    DISLIKE = 'dislike',
    LOVE = 'love',
}

export interface UserReaction {
    id: string;
    userId: string;
    type: TypeReaction;
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true, collection: 'users' });

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;