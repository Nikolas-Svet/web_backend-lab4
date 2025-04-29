// src/models/lesson.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import type { ICourse } from './course.model';

export interface ILesson extends Document {
    title: string;
    content?: string;
    videoUrl?: string;
    course: mongoose.Types.ObjectId | ICourse;
    order?: number;
    createdAt: Date;
}

const LessonSchema: Schema = new Schema({
    title:    { type: String, required: true },
    content:  { type: String },
    videoUrl: { type: String },
    course:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    order:    { type: Number },
    createdAt:{ type: Date, default: () => new Date() },
});

export default mongoose.model<ILesson>('Lesson', LessonSchema);