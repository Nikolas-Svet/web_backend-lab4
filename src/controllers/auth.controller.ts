// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {ErrorMessages} from "../utils/consts";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password, role } = req.body;

    if (!firstName || !lastName || !username || !password || !role) {
      res.status(400).json({ message: ErrorMessages.RegValidationAll });
      return;
    }

    if (!['student', 'teacher'].includes(role)) {
      res.status(400).json({ message: ErrorMessages.RegValidationRole });
      return;
    }

    const existingUser: IUser | null = await User.findOne({ username });
    if (existingUser) {
      res
        .status(400)
        .json({ message: ErrorMessages.RegValidationNickname });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: ErrorMessages.RegSuccessful });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: ErrorMessages.InternalServerError });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: ErrorMessages.AuthValidation });
      return;
    }

    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: ErrorMessages.Auth });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: ErrorMessages.Auth });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role, firstName: user.firstName,
        lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.json({ token });
  } catch (error) {
    console.error('Ошибка логина:', error);
    res.status(500).json({ message: ErrorMessages.InternalServerError });
  }
};
