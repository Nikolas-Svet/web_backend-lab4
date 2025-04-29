// src/models/comment.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import {ILesson} from "./lesson.model";
import {IUser} from "./user.model";

export interface IComment extends Document {
    text: string;
    lesson: mongoose.Types.ObjectId | ILesson;
    user: mongoose.Types.ObjectId | IUser;
}

const CommentSchema = new Schema({
    text: { type: String, required: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export default mongoose.model<IComment>("Comment", CommentSchema);
