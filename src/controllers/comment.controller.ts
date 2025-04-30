// src/controllers/comment.controller.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ErrorMessages } from '../utils/consts';
import Comment from "../models/comment.model";

export const createComment = async (req: Request, res: Response) => {
    try {
        const { text, lesson, user } = req.body;
        if (text !== undefined && text.trim().length === 0) {
            res.status(400).json({ message: ErrorMessages.CommentNotValidText });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(lesson) || !mongoose.Types.ObjectId.isValid(user)) {
            res.status(400).json({ message: ErrorMessages.CommentNotValidLessonUser });
            return;
        }
        const comment = new Comment({ text, lesson, user });
        await comment.save();
        res.status(201).json(lesson);
    } catch (error) {
        console.error('Ошибка создания урока:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
}

export const getComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName')
            .populate('lesson', 'title');
        res.json(comments);
    } catch (error) {
        console.error('Ошибка получения комментариев:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: ErrorMessages.CommentNotValidID });
        return;
    }
    try {
        const comment = await Comment.findById(id)
            .populate('user', 'firstName lastName')
            .populate('lesson', 'title');
        if (!comment) {
            res.status(404).json({ message: ErrorMessages.NotFound });
            return;
        }
        res.json(comment);
    } catch (error) {
        console.error('Ошибка получения комментария:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const updateCommentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: ErrorMessages.CommentNotValidID });
        return;
    }
    if (text !== undefined && text.trim().length === 0) {
        res.status(400).json({ message: ErrorMessages.CommentNotValidText });
        return;
    }
    try {
        const updates: any = {};
        if (text !== undefined) updates.text = text.trim();

        const updated = await Comment.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404).json({ message: ErrorMessages.NotFound });
            return;
        }
        res.json(updated);
    } catch (error) {
        console.error('Ошибка обновления комментария:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const deleteCommentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: ErrorMessages.ValidationId });
        return;
    }
    try {
        const deleted = await Comment.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: ErrorMessages.NotFound });
            return;
        }
        res.status(200).json({ message: ErrorMessages.CommentDeleteSuccessful });
    } catch (error) {
        console.error('Ошибка удаления комментария:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};
