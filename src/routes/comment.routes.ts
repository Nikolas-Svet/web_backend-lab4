// src/routes/comment.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { createComment, getComments, getCommentById, updateCommentById, deleteCommentById } from '../controllers/comment.controller';

const router = Router();

router.post('/', authenticateJWT, createComment);
router.get('/', getComments);
router.get('/:id', getCommentById);
router.put('/:id', authenticateJWT, updateCommentById);
router.delete('/:id', authenticateJWT, deleteCommentById);

export default router;