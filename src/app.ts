// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import path from "node:path";
import {API_PREFIX} from "./utils/consts";
import courseRoutes from "./routes/course.routes";
import cors from 'cors';
import lessonRoutes from "./routes/lesson.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(bodyParser.json());

app.use(`${API_PREFIX}auth`, authRoutes);
app.use(`${API_PREFIX}user`, userRoutes);
app.use(`${API_PREFIX}courses`,  courseRoutes);
app.use(`${API_PREFIX}lessons`, lessonRoutes);
app.use(`${API_PREFIX}comment`, commentRoutes);

export default app;
