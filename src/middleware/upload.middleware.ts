// src/middleware/upload.controller.ts
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_req: any, file: any, cb: any) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });