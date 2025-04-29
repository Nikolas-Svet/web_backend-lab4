// src/routes/user.routes.ts
import { Router } from 'express';
import {getProfile, deleteUser, getTeachers, updateUserPhoto} from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/me', authenticateJWT, getProfile);

router.delete('/:id', authenticateJWT, deleteUser);

router.get('/teachers', authenticateJWT, getTeachers);

router.put(
    '/me/photo',
    authenticateJWT,
    upload.single('photo'),
    updateUserPhoto
);

export default router;
