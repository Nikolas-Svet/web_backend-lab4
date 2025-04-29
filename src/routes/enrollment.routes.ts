import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
    createEnrollment,
    getEnrollments,
    getEnrollmentById,
    completeLesson,
    cancelLesson,
    deleteEnrollment,
    countStudents,
} from '../controllers/enrollment.controller';

const router = Router();

router.post('/', authenticateJWT, createEnrollment as any);
router.get('/', getEnrollments);
router.get('/:id', getEnrollmentById as any);
router.patch('/:id/complete/:lessonId', authenticateJWT, completeLesson as any);
router.patch('/:id/cancel/:lessonId', authenticateJWT, cancelLesson as any);
router.delete('/:id', authenticateJWT, deleteEnrollment as any);

router.get('/course/:courseId/count', authenticateJWT, countStudents);

export default router;