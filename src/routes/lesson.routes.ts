// src/routes/lesson.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
    createLesson,
    getLessons,
    getLessonById,
    updateLessonById,
    deleteLessonById
} from '../controllers/lesson.controller';

const router = Router();

router.post('/', authenticateJWT, createLesson);
router.get('/', getLessons);
router.get('/:id', getLessonById);
router.put('/:id', authenticateJWT, updateLessonById);
router.delete('/:id', authenticateJWT, deleteLessonById);

export default router;