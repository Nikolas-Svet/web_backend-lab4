import mongoose, { Document, Schema } from 'mongoose';
import type { ILesson } from './lesson.model';

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    completedLessons: mongoose.Types.ObjectId[];
    progress: number;
    createdAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
    user:             { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course:           { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    progress:         { type: Number, default: 0 },
    createdAt:        { type: Date, default: () => new Date() },
});

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);