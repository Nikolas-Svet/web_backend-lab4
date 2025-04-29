// src/utils/progress.utils.ts
import Lesson from '../models/lesson.model';
import type { IEnrollment } from '../models/enrollment.model';

export async function calculateProgress(enrollment: IEnrollment): Promise<number> {
    const total = await Lesson.countDocuments({ course: enrollment.course });
    if (total === 0) return 0;
    const done = enrollment.completedLessons.length;
    return Math.round((done / total) * 100);
}