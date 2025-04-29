import EnrollmentModel, { IEnrollment } from '../models/enrollment.model';
import type { IEnrollment as _E } from '../models/enrollment.model';
import { calculateProgress } from '../utils/progress.utils';
import mongoose from 'mongoose';

export class EnrollmentService {
    static async enroll(userId: string, courseId: string): Promise<IEnrollment> {
        const doc = new EnrollmentModel({
            user: userId,
            course: courseId,
            completedLessons: [],
        });
        const saved = await doc.save();
        saved.progress = await calculateProgress(saved);
        await saved.save();
        return saved;
    }

    static async list(filter: Partial<{ user: string; course: string }>): Promise<IEnrollment[]> {
        return EnrollmentModel.find(filter)
            .populate('user', 'firstName lastName')
            .populate('course', 'title')
            .lean();
    }

    static async getById(id: string): Promise<IEnrollment | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return EnrollmentModel.findById(id)
            .populate('completedLessons')
            .populate('course', 'title')
            .lean();
    }

    static async completeLesson(enrollmentId: string, lessonId: string): Promise<IEnrollment | null> {
        const updated = await EnrollmentModel.findByIdAndUpdate(
            enrollmentId,
            { $addToSet: { completedLessons: lessonId } },
            { new: true }
        );
        if (!updated) return null;
        updated.progress = await calculateProgress(updated);
        await updated.save();
        return updated;
    }

    static async cancelLesson(enrollmentId: string, lessonId: string): Promise<IEnrollment | null> {
        const updated = await EnrollmentModel.findByIdAndUpdate(
            enrollmentId,
            { $pull: { completedLessons: lessonId } },
            { new: true }
        );
        if (!updated) return null;
        updated.progress = await calculateProgress(updated);
        await updated.save();
        return updated;
    }

    static async remove(enrollmentId: string): Promise<boolean> {
        const result = await EnrollmentModel.findByIdAndDelete(enrollmentId);
        return !!result;
    }

    static async countStudents(courseId: string): Promise<number> {
        return EnrollmentModel.countDocuments({ course: courseId });
    }
}