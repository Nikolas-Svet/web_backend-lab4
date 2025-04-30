// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User, { IUser } from '../models/user.model';
import {ErrorMessages} from "../utils/consts";
import {processImage} from "../utils/image.utils";

export const updateUserPhoto = async (
    req: AuthRequest & { file?: Express.Multer.File },
    res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: ErrorMessages.GetInfoNotAuth });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: 'Фото не предоставлено' });
      return;
    }

    const processedPath = await processImage(req.file.path);

    const updated: IUser | null = await User.findByIdAndUpdate(
        userId,
        { photo: processedPath },
        { new: true }
    ).select('-password');

    if (!updated) {
      res.status(404).json({ message: ErrorMessages.NotFoundUser });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error('Ошибка обновления фото:', error);
    res.status(500).json({ message: ErrorMessages.InternalServerError });
  }
};

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('firstName lastName photo');
    res.json(teachers);
  } catch (error) {
    console.error('Ошибка получения преподавателей:', error);
    res.status(500).json({ message: ErrorMessages.InternalServerError });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: ErrorMessages.GetInfoNotAuth });
      return;
    }

    const user: IUser | null = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: ErrorMessages.NotFoundUser });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: ErrorMessages.InternalServerError });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user: IUser | null = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: ErrorMessages.NotFoundUser });
      return;
    }
    res.json({ message: ErrorMessages.delSuccessful });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({ message: ErrorMessages.InternalServerError });
  }
};
