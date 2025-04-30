// src/controllers/lesson.controller.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Lesson from '../models/lesson.model';
import { ErrorMessages } from '../utils/consts';

export const createLesson = async (req: Request, res: Response) => {
    try {
        const { title, content, videoUrl, course, order } = req.body;
        if (!title || !course) {
            res.status(400).json({ message: ErrorMessages.LessonNotValid });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(course)) {
            res.status(400).json({ message: ErrorMessages.LessonNotValidID });
            return;
        }
        const lesson = new Lesson({ title, content, videoUrl, course, order });
        await lesson.save();
        res.status(201).json(lesson);
    } catch (error) {
        console.error('Ошибка создания урока:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const getLessons = async (req: Request, res: Response) => {
    try {
        const lessons = await Lesson.find().sort({ order: 1, createdAt: -1 });
        res.json(lessons);
    } catch (error) {
        console.error('Ошибка получения уроков:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const getLessonById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: ErrorMessages.LessonNotValidID });
        return;
    }
    try {
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            res.status(404).json({ message: ErrorMessages.NotFound });
            return;
        }
        res.json(lesson);
    } catch (error) {
        console.error('Ошибка получения урока:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const updateLessonById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: ErrorMessages.LessonNotValidID });
        return;
    }
    try {
        const updates = req.body;
        if (updates.course && !mongoose.Types.ObjectId.isValid(updates.course)) {
            res.status(400).json({ message: ErrorMessages.LessonNotValidID });
            return;
        }
        const updated = await Lesson.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updated) {
            res.status(404).json({ message: ErrorMessages.NotFound });
            return;
        }
        res.json(updated);
    } catch (error) {
        console.error('Ошибка обновления урока:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const deleteLessonById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: ErrorMessages.LessonNotValidID });
        return;
    }
    try {
        const deleted = await Lesson.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: ErrorMessages.NotFound });
            return;
        }
        res.json({ message: ErrorMessages.LessonDeleteSuccessful });
    } catch (error) {
        console.error('Ошибка удаления урока:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};